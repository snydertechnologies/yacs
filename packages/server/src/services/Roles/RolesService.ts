import {
  ICreateRoleDTO,
  ICreateRolePermissionDTO,
  IEditRoleDTO,
  IEditRolePermissionDTO,
  IRole,
  IRoleCreatedPayload,
  IRoleDeletedPayload,
  IRoleEditedPayload,
} from '@bigcapital/libs-backend';
import { ServiceError } from '@bigcapital/server/exceptions';
import { EventPublisher } from '@bigcapital/server/lib/EventPublisher/EventPublisher';
import { TransformerInjectable } from '@bigcapital/server/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@bigcapital/server/services/Tenancy/TenancyService';
import UnitOfWork from '@bigcapital/server/services/UnitOfWork';
import events from '@bigcapital/server/subscribers/events';
import Knex from 'knex';
import { Inject, Service } from 'typedi';
import { AbilitySchema } from './AbilitySchema';
import { RoleTransformer } from './RoleTransformer';
import { ERRORS } from './constants';
import { getInvalidPermissions } from './utils';

@Service()
export default class RolesService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Creates a new role and store it to the storage.
   * @param {number} tenantId
   * @param {ICreateRoleDTO} createRoleDTO
   * @returns
   */
  public createRole = async (tenantId: number, createRoleDTO: ICreateRoleDTO) => {
    const { Role } = this.tenancy.models(tenantId);

    // Validates the invalid permissions.
    this.validateInvalidPermissions(createRoleDTO.permissions);

    // Transformes the permissions DTO.
    const permissions = this.tranaformPermissionsDTO(createRoleDTO.permissions);

    // Creates a new role with associated entries under unit-of-work.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Creates a new role to the storage.
      const role = await Role.query(trx).upsertGraph({
        name: createRoleDTO.roleName,
        description: createRoleDTO.roleDescription,
        permissions,
      });
      // Triggers `onRoleCreated` event.
      await this.eventPublisher.emitAsync(events.roles.onCreated, {
        tenantId,
        createRoleDTO,
        role,
        trx,
      } as IRoleCreatedPayload);
      return role;
    });
  };

  /**
   * Edits details of the given role on the storage.
   * @param {number} tenantId -
   * @param {number} roleId -
   * @param {IEditRoleDTO} editRoleDTO - Edit role DTO.
   */
  public editRole = async (tenantId: number, roleId: number, editRoleDTO: IEditRoleDTO) => {
    const { Role } = this.tenancy.models(tenantId);

    // Validates the invalid permissions.
    this.validateInvalidPermissions(editRoleDTO.permissions);

    // Retrieve the given role or throw not found serice error.
    const oldRole = await this.getRoleOrThrowError(tenantId, roleId);

    const permissions = this.tranaformEditPermissionsDTO(editRoleDTO.permissions);
    // Updates the role on the storage.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Updates the given role to the storage.
      const role = await Role.query(trx).upsertGraph({
        id: roleId,
        name: editRoleDTO.roleName,
        description: editRoleDTO.roleDescription,
        permissions,
      });
      // Triggers `onRoleEdited` event.
      await this.eventPublisher.emitAsync(events.roles.onEdited, {
        editRoleDTO,
        oldRole,
        role,
        trx,
      } as IRoleEditedPayload);

      return role;
    });
  };

  /**
   * Retrieve the role or throw not found service error.
   * @param {number} tenantId
   * @param {number} roleId
   * @returns {Promise<IRole>}
   */
  public getRoleOrThrowError = async (tenantId: number, roleId: number): Promise<IRole> => {
    const { Role } = this.tenancy.models(tenantId);

    const role = await Role.query().findById(roleId);

    this.throwRoleNotFound(role);

    return role;
  };

  /**
   * Throw role not found service error if the role is not found.
   * @param {IRole|null} role
   */
  private throwRoleNotFound(role: IRole | null) {
    if (!role) {
      throw new ServiceError(ERRORS.ROLE_NOT_FOUND);
    }
  }

  /**
   * Deletes the given role from the storage.
   * @param {number} tenantId -
   * @param {number} roleId - Role id.
   */
  public deleteRole = async (tenantId: number, roleId: number): Promise<void> => {
    const { Role, RolePermission } = this.tenancy.models(tenantId);

    // Retrieve the given role or throw not found serice error.
    const oldRole = await this.getRoleOrThrowError(tenantId, roleId);

    // Validate role is not predefined.
    this.validateRoleNotPredefined(oldRole);

    // Validates the given role is not associated to any user.
    await this.validateRoleNotAssociatedToUser(tenantId, roleId);

    // Deletes the given role and associated models under unit-of-work envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Deletes the role associated permissions from the storage.
      await RolePermission.query(trx).where('roleId', roleId).delete();

      // Deletes the role object form the storage.
      await Role.query(trx).findById(roleId).delete();

      // Triggers `onRoleDeleted` event.
      await this.eventPublisher.emitAsync(events.roles.onDeleted, {
        oldRole,
        roleId,
        tenantId,
        trx,
      } as IRoleDeletedPayload);
    });
  };

  /**
   * Retrieve the roles list.
   * @param {number} tenantId
   * @param {Promise<IRole[]>}
   */
  public listRoles = async (tenantId: number): Promise<IRole[]> => {
    const { Role } = this.tenancy.models(tenantId);

    const roles = await Role.query().withGraphFetched('permissions');

    return this.transformer.transform(tenantId, roles, new RoleTransformer());
  };

  /**
   * Retrieve the given role metadata.
   * @param {number} tenantId
   * @param {number} roleId - Role id.
   * @returns {Promise<IRole>}
   */
  public getRole = async (tenantId: number, roleId: number): Promise<IRole> => {
    const { Role } = this.tenancy.models(tenantId);

    const role = await Role.query().findById(roleId).withGraphFetched('permissions');

    this.throwRoleNotFound(role);

    return this.transformer.transform(tenantId, role, new RoleTransformer());
  };

  /**
   * Valdiates role is not predefined.
   * @param {IRole} role - Role object.
   */
  private validateRoleNotPredefined(role: IRole) {
    if (role.predefined) {
      throw new ServiceError(ERRORS.ROLE_PREFINED);
    }
  }

  /**
   * Validates the invalid given permissions.
   * @param {ICreateRolePermissionDTO[]} permissions -
   */
  public validateInvalidPermissions = (permissions: ICreateRolePermissionDTO[]) => {
    const invalidPerms = getInvalidPermissions(AbilitySchema, permissions);

    if (invalidPerms.length > 0) {
      throw new ServiceError(ERRORS.INVALIDATE_PERMISSIONS, null, {
        invalidPermissions: invalidPerms,
      });
    }
  };

  /**
   * Transformes new permissions DTO.
   * @param {ICreateRolePermissionDTO[]} permissions
   * @returns {ICreateRolePermissionDTO[]}
   */
  private tranaformPermissionsDTO = (permissions: ICreateRolePermissionDTO[]) => {
    return permissions.map((permission: ICreateRolePermissionDTO) => ({
      subject: permission.subject,
      ability: permission.ability,
      value: permission.value,
    }));
  };

  /**
   * Transformes edit permissions DTO.
   * @param {ICreateRolePermissionDTO[]} permissions
   * @returns {IEditRolePermissionDTO[]}
   */
  private tranaformEditPermissionsDTO = (permissions: IEditRolePermissionDTO[]) => {
    return permissions.map((permission: IEditRolePermissionDTO) => ({
      permissionId: permission.permissionId,
      subject: permission.subject,
      ability: permission.ability,
      value: permission.value,
    }));
  };

  /**
   * Validates the given role is not associated to any tenant users.
   * @param {number} tenantId
   * @param {number} roleId
   */
  private validateRoleNotAssociatedToUser = async (tenantId: number, roleId: number) => {
    const { User } = this.tenancy.models(tenantId);

    const userAssociatedRole = await User.query().where('roleId', roleId);

    // Throw service error if the role has associated users.
    if (userAssociatedRole.length > 0) {
      throw new ServiceError(ERRORS.CANNT_DELETE_ROLE_ASSOCIATED_TO_USERS);
    }
  };
}
