import { ACCOUNT_TYPES, getAccountsSupportsMultiCurrency } from '@bigcapital/server/data/AccountTypes';
import AccountTypesUtils from '@bigcapital/server/lib/AccountTypes';
import DependencyGraph from '@bigcapital/server/lib/DependencyGraph';
import { buildSortColumnQuery } from '@bigcapital/server/lib/ViewRolesBuilder';
import TenantModel from '@bigcapital/server/models/TenantModel';
import { DEFAULT_VIEWS } from '@bigcapital/server/services/Accounts/constants';
import { flatToNestedArray } from '@bigcapital/server/utils';
import { castArray } from 'lodash';
import { Model, mixin } from 'objection';
import AccountSettings from './Account.Settings';
import CustomViewBaseModel from './CustomViewBaseModel';
import ModelSearchable from './ModelSearchable';
import ModelSettings from './ModelSetting';

export default class Account extends mixin(TenantModel, [ModelSettings, CustomViewBaseModel, ModelSearchable]) {
  /**
   * Table name.
   */
  static get tableName() {
    return 'accounts';
  }

  /**
   * Timestamps columns.
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [
      'accountTypeLabel',
      'accountParentType',
      'accountRootType',
      'accountNormal',
      'accountNormalFormatted',
      'isBalanceSheetAccount',
      'isPLSheet',
    ];
  }

  /**
   * Account normal.
   */
  get accountNormal() {
    return AccountTypesUtils.getType(this.accountType, 'normal');
  }

  get accountNormalFormatted() {
    const paris = {
      credit: 'Credit',
      debit: 'Debit',
    };
    return paris[this.accountNormal] || '';
  }

  /**
   * Retrieve account type label.
   */
  get accountTypeLabel() {
    return AccountTypesUtils.getType(this.accountType, 'label');
  }

  /**
   * Retrieve account parent type.
   */
  get accountParentType() {
    return AccountTypesUtils.getType(this.accountType, 'parentType');
  }

  /**
   * Retrieve account root type.
   */
  get accountRootType() {
    return AccountTypesUtils.getType(this.accountType, 'rootType');
  }

  /**
   * Retrieve whether the account is balance sheet account.
   */
  get isBalanceSheetAccount() {
    return this.isBalanceSheet();
  }

  /**
   * Retrieve whether the account is profit/loss sheet account.
   */
  get isPLSheet() {
    return this.isProfitLossSheet();
  }
  /**
   * Allows to mark model as resourceable to viewable and filterable.
   */
  static get resourceable() {
    return true;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    const TABLE_NAME = Account.tableName;

    return {
      /**
       * Inactive/Active mode.
       */
      inactiveMode(query, active = false) {
        query.where('accounts.active', !active);
      },

      filterAccounts(query, accountIds) {
        if (accountIds.length > 0) {
          query.whereIn(`${TABLE_NAME}.id`, accountIds);
        }
      },
      filterAccountTypes(query, typesIds) {
        if (typesIds.length > 0) {
          query.whereIn('account_types.account_type_id', typesIds);
        }
      },
      viewRolesBuilder(query, conditionals, expression) {
        // buildFilterQuery(Account.tableName, conditionals, expression)(query); @TODO: Inam, uncomment this line
      },
      sortColumnBuilder(query, columnKey, direction) {
        buildSortColumnQuery(Account.tableName, columnKey, direction)(query);
      },

      /**
       * Filter by root type.
       */
      filterByRootType(query, rootType) {
        const filterTypes = ACCOUNT_TYPES.filter((accountType) => accountType.rootType === rootType).map(
          (accountType) => accountType.key,
        );

        query.whereIn('account_type', filterTypes);
      },

      /**
       * Filter by account normal
       */
      filterByAccountNormal(query, accountNormal) {
        const filterTypes = ACCOUNT_TYPES.filter((accountType) => accountType.normal === accountNormal).map(
          (accountType) => accountType.key,
        );

        query.whereIn('account_type', filterTypes);
      },

      /**
       * Finds account by the given slug.
       * @param {*} query
       * @param {*} slug
       */
      findBySlug(query, slug) {
        query.where('slug', slug).first();
      },

      /**
       *
       * @param {*} query
       * @param {*} baseCyrrency
       */
      preventMutateBaseCurrency(query) {
        const accountsTypes = getAccountsSupportsMultiCurrency();
        const accountsTypesKeys = accountsTypes.map((type) => type.key);

        query.whereIn('accountType', accountsTypesKeys).where('seededAt', null).first();
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const AccountTransaction = require('@bigcapital/server/models/AccountTransaction');
    const Item = require('@bigcapital/server/models/Item');
    const InventoryAdjustment = require('@bigcapital/server/models/InventoryAdjustment');
    const ManualJournalEntry = require('@bigcapital/server/models/ManualJournalEntry');
    const Expense = require('@bigcapital/server/models/Expense');
    const ExpenseEntry = require('@bigcapital/server/models/ExpenseCategory');
    const ItemEntry = require('@bigcapital/server/models/ItemEntry');
    const UncategorizedTransaction = require('@bigcapital/server/models/UncategorizedCashflowTransaction');

    return {
      /**
       * Account model may has many transactions.
       */
      transactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction.default,
        join: {
          from: 'accounts.id',
          to: 'accounts_transactions.accountId',
        },
      },

      /**
       *
       */
      itemsCostAccount: {
        relation: Model.HasManyRelation,
        modelClass: Item.default,
        join: {
          from: 'accounts.id',
          to: 'items.costAccountId',
        },
      },

      /**
       *
       */
      itemsSellAccount: {
        relation: Model.HasManyRelation,
        modelClass: Item.default,
        join: {
          from: 'accounts.id',
          to: 'items.sellAccountId',
        },
      },

      /**
       *
       */
      inventoryAdjustments: {
        relation: Model.HasManyRelation,
        modelClass: InventoryAdjustment.default,
        join: {
          from: 'accounts.id',
          to: 'inventory_adjustments.adjustmentAccountId',
        },
      },

      /**
       *
       */
      manualJournalEntries: {
        relation: Model.HasManyRelation,
        modelClass: ManualJournalEntry.default,
        join: {
          from: 'accounts.id',
          to: 'manual_journals_entries.accountId',
        },
      },

      /**
       *
       */
      expensePayments: {
        relation: Model.HasManyRelation,
        modelClass: Expense.default,
        join: {
          from: 'accounts.id',
          to: 'expenses_transactions.paymentAccountId',
        },
      },

      /**
       *
       */
      expenseEntries: {
        relation: Model.HasManyRelation,
        modelClass: ExpenseEntry.default,
        join: {
          from: 'accounts.id',
          to: 'expense_transaction_categories.expenseAccountId',
        },
      },

      /**
       *
       */
      entriesCostAccount: {
        relation: Model.HasManyRelation,
        modelClass: ItemEntry.default,
        join: {
          from: 'accounts.id',
          to: 'items_entries.costAccountId',
        },
      },

      /**
       *
       */
      entriesSellAccount: {
        relation: Model.HasManyRelation,
        modelClass: ItemEntry.default,
        join: {
          from: 'accounts.id',
          to: 'items_entries.sellAccountId',
        },
      },

      /**
       * Associated uncategorized transactions.
       */
      uncategorizedTransactions: {
        relation: Model.HasManyRelation,
        modelClass: UncategorizedTransaction.default,
        join: {
          from: 'accounts.id',
          to: 'uncategorized_cashflow_transactions.accountId',
        },
        filter: (query) => {
          query.where('categorized', false);
        },
      },
    };
  }

  /**
   * Detarmines whether the given type equals the account type.
   * @param {string} accountType
   * @return {boolean}
   */
  isAccountType(accountType) {
    const types = castArray(accountType);
    return types.indexOf(this.accountType) !== -1;
  }

  /**
   * Detarmines whether the given root type equals the account type.
   * @param {string} rootType
   * @return {boolean}
   */
  isRootType(rootType) {
    return AccountTypesUtils.isRootTypeEqualsKey(this.accountType, rootType);
  }

  /**
   * Detarmine whether the given parent type equals the account type.
   * @param {string} parentType
   * @return {boolean}
   */
  isParentType(parentType) {
    return AccountTypesUtils.isParentTypeEqualsKey(this.accountType, parentType);
  }

  /**
   * Detarmines whether the account is balance sheet account.
   * @return {boolean}
   */
  isBalanceSheet() {
    return AccountTypesUtils.isTypeBalanceSheet(this.accountType);
  }

  /**
   * Detarmines whether the account is profit/loss account.
   * @return {boolean}
   */
  isProfitLossSheet() {
    return AccountTypesUtils.isTypePLSheet(this.accountType);
  }

  /**
   * Detarmines whether the account is income statement account
   * @return {boolean}
   */
  isIncomeSheet() {
    return this.isProfitLossSheet();
  }

  /**
   * Converts flatten accounts list to nested array.
   * @param {Array} accounts
   * @param {Object} options
   */
  static toNestedArray(accounts, options = { children: 'children' }) {
    return flatToNestedArray(accounts, {
      id: 'id',
      parentId: 'parentAccountId',
    });
  }

  /**
   * Transformes the accounts list to depenedency graph structure.
   * @param {IAccount[]} accounts
   */
  static toDependencyGraph(accounts) {
    return DependencyGraph.fromArray(accounts, {
      itemId: 'id',
      parentItemId: 'parentAccountId',
    });
  }

  /**
   * Model settings.
   */
  static get meta() {
    return AccountSettings;
  }

  /**
   * Retrieve the default custom views, roles and columns.
   */
  static get defaultViews() {
    return DEFAULT_VIEWS;
  }

  /**
   * Model search roles.
   */
  static get searchRoles() {
    return [
      { condition: 'or', fieldKey: 'name', comparator: 'contains' },
      { condition: 'or', fieldKey: 'code', comparator: 'like' },
    ];
  }

  /**
   * Prevents mutate base currency since the model is not empty.
   */
  static get preventMutateBaseCurrency() {
    return true;
  }
}
