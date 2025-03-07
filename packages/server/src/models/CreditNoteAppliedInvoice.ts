import TenantModel from '@bigcapital/server/models/TenantModel';
import { Model, mixin } from 'objection';
import CustomViewBaseModel from './CustomViewBaseModel';
import ModelSearchable from './ModelSearchable';
import ModelSetting from './ModelSetting';

export default class CreditNoteAppliedInvoice extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'credit_note_applied_invoice';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['created_at', 'updated_at'];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const SaleInvoice = require('@bigcapital/server/models/SaleInvoice');
    const CreditNote = require('@bigcapital/server/models/CreditNote');

    return {
      saleInvoice: {
        relation: Model.BelongsToOneRelation,
        modelClass: SaleInvoice.default,
        join: {
          from: 'credit_note_applied_invoice.invoiceId',
          to: 'sales_invoices.id',
        },
      },

      creditNote: {
        relation: Model.BelongsToOneRelation,
        modelClass: CreditNote.default,
        join: {
          from: 'credit_note_applied_invoice.creditNoteId',
          to: 'credit_notes.id',
        },
      },
    };
  }
}
