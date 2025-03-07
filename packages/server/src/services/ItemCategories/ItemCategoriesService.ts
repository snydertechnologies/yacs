import {
  IFilterMeta,
  IItemCategoriesFilter,
  IItemCategoriesService,
  IItemCategory,
  IItemCategoryCreatedPayload,
  IItemCategoryDeletedPayload,
  IItemCategoryEditedPayload,
  IItemCategoryOTD,
  ISystemUser,
} from '@bigcapital/libs-backend';
import { ACCOUNT_ROOT_TYPE, ACCOUNT_TYPE } from '@bigcapital/server/data/AccountTypes';
import { ServiceError } from '@bigcapital/server/exceptions';
import { EventPublisher } from '@bigcapital/server/lib/EventPublisher/EventPublisher';
import DynamicListingService from '@bigcapital/server/services/DynamicListing/DynamicListService';
import TenancyService from '@bigcapital/server/services/Tenancy/TenancyService';
import UnitOfWork from '@bigcapital/server/services/UnitOfWork';
import events from '@bigcapital/server/subscribers/events';
import { Knex } from 'knex';
import * as R from 'ramda';
import { Inject } from 'typedi';
import { ERRORS } from './constants';

export default class ItemCategoriesService implements IItemCategoriesService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject('logger')
  logger: any;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject()
  uow: UnitOfWork;

  /**
   * Retrieve item category or throw not found error.
   * @param {number} tenantId
   * @param {number} itemCategoryId
   */
  private async getItemCategoryOrThrowError(tenantId: number, itemCategoryId: number) {
    const { ItemCategory } = this.tenancy.models(tenantId);
    const category = await ItemCategory.query().findById(itemCategoryId);

    if (!category) {
      throw new ServiceError(ERRORS.CATEGORY_NOT_FOUND);
    }
    return category;
  }

  /**
   * Transforms OTD to model object.
   * @param {IItemCategoryOTD} itemCategoryOTD
   * @param {ISystemUser} authorizedUser
   */
  private transformOTDToObject(itemCategoryOTD: IItemCategoryOTD, authorizedUser: ISystemUser) {
    return { ...itemCategoryOTD, userId: authorizedUser.id };
  }

  /**
   * Retrieve item category of the given id.
   * @param {number} tenantId -
   * @param {number} itemCategoryId -
   * @returns {IItemCategory}
   */
  public async getItemCategory(tenantId: number, itemCategoryId: number, user: ISystemUser) {
    return this.getItemCategoryOrThrowError(tenantId, itemCategoryId);
  }

  /**
   * Validates the category name uniquiness.
   * @param {number} tenantId - Tenant id.
   * @param {string} categoryName - Category name.
   * @param {number} notAccountId - Ignore the account id.
   */
  private async validateCategoryNameUniquiness(tenantId: number, categoryName: string, notCategoryId?: number) {
    const { ItemCategory } = this.tenancy.models(tenantId);

    const foundItemCategory = await ItemCategory.query()
      .findOne('name', categoryName)
      .onBuild((query) => {
        if (notCategoryId) {
          query.whereNot('id', notCategoryId);
        }
      });
    if (foundItemCategory) {
      throw new ServiceError(ERRORS.CATEGORY_NAME_EXISTS, 'The item category name is already exist.');
    }
  }

  /**
   * Inserts a new item category.
   * @param {number} tenantId
   * @param {IItemCategoryOTD} itemCategoryOTD
   * @return {Promise<void>}
   */
  public async newItemCategory(
    tenantId: number,
    itemCategoryOTD: IItemCategoryOTD,
    authorizedUser: ISystemUser,
    trx?: Knex.Transaction,
  ): Promise<IItemCategory> {
    const { ItemCategory } = this.tenancy.models(tenantId);

    // Validate the category name uniquiness.
    await this.validateCategoryNameUniquiness(tenantId, itemCategoryOTD.name);

    if (itemCategoryOTD.sellAccountId) {
      await this.validateSellAccount(tenantId, itemCategoryOTD.sellAccountId);
    }
    if (itemCategoryOTD.costAccountId) {
      await this.validateCostAccount(tenantId, itemCategoryOTD.costAccountId);
    }
    if (itemCategoryOTD.inventoryAccountId) {
      await this.validateInventoryAccount(tenantId, itemCategoryOTD.inventoryAccountId);
    }
    const itemCategoryObj = this.transformOTDToObject(itemCategoryOTD, authorizedUser);
    // Creates item category under unit-of-work evnirement.
    return this.uow.withTransaction(
      tenantId,
      async (trx: Knex.Transaction) => {
        // Inserts the item category.
        const itemCategory = await ItemCategory.query(trx).insert({
          ...itemCategoryObj,
        });
        // Triggers `onItemCategoryCreated` event.
        await this.eventPublisher.emitAsync(events.itemCategory.onCreated, {
          itemCategory,
          tenantId,
          trx,
        } as IItemCategoryCreatedPayload);

        return itemCategory;
      },
      trx,
    );
  }

  /**
   * Validates sell account existance and type.
   * @param {number} tenantId - Tenant id.
   * @param {number} sellAccountId - Sell account id.
   * @return {Promise<void>}
   */
  private async validateSellAccount(tenantId: number, sellAccountId: number) {
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const foundAccount = await accountRepository.findOneById(sellAccountId);

    if (!foundAccount) {
      throw new ServiceError(ERRORS.SELL_ACCOUNT_NOT_FOUND);
    } else if (!foundAccount.isRootType(ACCOUNT_ROOT_TYPE.INCOME)) {
      throw new ServiceError(ERRORS.SELL_ACCOUNT_NOT_INCOME);
    }
  }

  /**
   * Validates COGS account existance and type.
   * @param {number} tenantId -
   * @param {number} costAccountId -
   * @return {Promise<void>}
   */
  private async validateCostAccount(tenantId: number, costAccountId: number) {
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const foundAccount = await accountRepository.findOneById(costAccountId);

    if (!foundAccount) {
      throw new ServiceError(ERRORS.COST_ACCOUNT_NOT_FOUMD);
    } else if (!foundAccount.isRootType(ACCOUNT_ROOT_TYPE.EXPENSE)) {
      throw new ServiceError(ERRORS.COST_ACCOUNT_NOT_COGS);
    }
  }

  /**
   * Validates inventory account existance and type.
   * @param {number} tenantId
   * @param {number} inventoryAccountId
   * @return {Promise<void>}
   */
  private async validateInventoryAccount(tenantId: number, inventoryAccountId: number) {
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const foundAccount = await accountRepository.findOneById(inventoryAccountId);
    if (!foundAccount) {
      throw new ServiceError(ERRORS.INVENTORY_ACCOUNT_NOT_FOUND);
    } else if (!foundAccount.isAccountType(ACCOUNT_TYPE.INVENTORY)) {
      throw new ServiceError(ERRORS.INVENTORY_ACCOUNT_NOT_INVENTORY);
    }
  }

  /**
   * Edits item category.
   * @param {number} tenantId
   * @param {number} itemCategoryId
   * @param {IItemCategoryOTD} itemCategoryOTD
   * @return {Promise<void>}
   */
  public async editItemCategory(
    tenantId: number,
    itemCategoryId: number,
    itemCategoryOTD: IItemCategoryOTD,
    authorizedUser: ISystemUser,
  ): Promise<IItemCategory> {
    const { ItemCategory } = this.tenancy.models(tenantId);

    // Retrieve the item category from the storage.
    const oldItemCategory = await this.getItemCategoryOrThrowError(tenantId, itemCategoryId);
    // Validate the category name whether unique on the storage.
    await this.validateCategoryNameUniquiness(tenantId, itemCategoryOTD.name, itemCategoryId);
    if (itemCategoryOTD.sellAccountId) {
      await this.validateSellAccount(tenantId, itemCategoryOTD.sellAccountId);
    }
    if (itemCategoryOTD.costAccountId) {
      await this.validateCostAccount(tenantId, itemCategoryOTD.costAccountId);
    }
    if (itemCategoryOTD.inventoryAccountId) {
      await this.validateInventoryAccount(tenantId, itemCategoryOTD.inventoryAccountId);
    }
    const itemCategoryObj = this.transformOTDToObject(itemCategoryOTD, authorizedUser);
    //
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      //
      const itemCategory = await ItemCategory.query().patchAndFetchById(itemCategoryId, { ...itemCategoryObj });
      // Triggers `onItemCategoryEdited` event.
      await this.eventPublisher.emitAsync(events.itemCategory.onEdited, {
        oldItemCategory,
        tenantId,
        trx,
      } as IItemCategoryEditedPayload);

      return itemCategory;
    });
  }

  /**
   * Deletes the given item category.
   * @param {number} tenantId - Tenant id.
   * @param {number} itemCategoryId - Item category id.
   * @return {Promise<void>}
   */
  public async deleteItemCategory(tenantId: number, itemCategoryId: number, authorizedUser: ISystemUser) {
    const { ItemCategory } = this.tenancy.models(tenantId);

    // Retrieve item category or throw not found error.
    const oldItemCategory = await this.getItemCategoryOrThrowError(tenantId, itemCategoryId);

    //
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Unassociate items with item category.
      await this.unassociateItemsWithCategories(tenantId, itemCategoryId, trx);

      //
      await ItemCategory.query(trx).findById(itemCategoryId).delete();

      //
      await this.eventPublisher.emitAsync(events.itemCategory.onDeleted, {
        tenantId,
        itemCategoryId,
        oldItemCategory,
      } as IItemCategoryDeletedPayload);
    });
  }

  /**
   * Parses items categories filter DTO.
   * @param {} filterDTO
   * @returns
   */
  private parsesListFilterDTO(filterDTO) {
    return R.compose(
      // Parses stringified filter roles.
      this.dynamicListService.parseStringifiedFilter,
    )(filterDTO);
  }

  /**
   * Retrieve item categories list.
   * @param {number} tenantId
   * @param filter
   */
  public async getItemCategoriesList(
    tenantId: number,
    filterDTO: IItemCategoriesFilter,
    authorizedUser: ISystemUser,
  ): Promise<{ itemCategories: IItemCategory[]; filterMeta: IFilterMeta }> {
    const { ItemCategory } = this.tenancy.models(tenantId);

    // Parses list filter DTO.
    const filter = this.parsesListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(tenantId, ItemCategory, filter);
    // Items categories.
    const itemCategories = await ItemCategory.query().onBuild((query) => {
      // Subquery to calculate sumation of associated items to the item category.
      query.select('*', ItemCategory.relatedQuery('items').count().as('count'));

      dynamicList.buildQuery()(query);
    });
    return { itemCategories, filterMeta: dynamicList.getResponseMeta() };
  }

  /**
   * Unlink items relations with item categories.
   * @param {number} tenantId
   * @param {number|number[]} itemCategoryId -
   * @return {Promise<void>}
   */
  private async unassociateItemsWithCategories(
    tenantId: number,
    itemCategoryId: number | number[],
    trx?: Knex.Transaction,
  ): Promise<void> {
    const { Item } = this.tenancy.models(tenantId);
    const ids = Array.isArray(itemCategoryId) ? itemCategoryId : [itemCategoryId];

    await Item.query(trx).whereIn('category_id', ids).patch({ category_id: null });
  }
}
