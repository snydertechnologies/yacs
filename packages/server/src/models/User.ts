import TenantModel from '@bigcapital/server/models/TenantModel';
import { Model } from 'objection';

export default class User extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'users';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['created_at', 'updated_at'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['isInviteAccepted', 'fullName'];
  }

  /**
   * Detarmines whether the user ivnite is accept.
   */
  get isInviteAccepted() {
    return !!this.inviteAcceptedAt;
  }

  /**
   * Full name attribute.
   */
  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Role = require('@bigcapital/server/models/Role');

    return {
      /**
       * User belongs to user.
       */
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role.default,
        join: {
          from: 'users.roleId',
          to: 'roles.id',
        },
      },
    };
  }
}
