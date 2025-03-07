import TenantModel from '@bigcapital/server/models/TenantModel';
import { Model, mixin } from 'objection';
import CustomViewBaseModel from './CustomViewBaseModel';
import ModelSearchable from './ModelSearchable';
import ModelSetting from './ModelSetting';

export default class RefundVendorCredit extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
  /**
   * Table name.
   */
  static get tableName() {
    return 'refund_vendor_credit_transactions';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['created_at', 'updated_at'];
  }

  /*
   * Relationship mapping.
   */
  static get relationMappings() {
    const VendorCredit = require('@bigcapital/server/models/VendorCredit');
    const Account = require('@bigcapital/server/models/Account');

    return {
      depositAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'refund_vendor_credit_transactions.depositAccountId',
          to: 'accounts.id',
        },
      },
      vendorCredit: {
        relation: Model.BelongsToOneRelation,
        modelClass: VendorCredit.default,
        join: {
          from: 'refund_vendor_credit_transactions.vendorCreditId',
          to: 'vendor_credits.id',
        },
      },
    };
  }
}
