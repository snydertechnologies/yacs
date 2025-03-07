import { IVendorCreditDeletedPayload, IVendorCreditDeletingPayload } from '@bigcapital/libs-backend';
import { ServiceError } from '@bigcapital/server/exceptions';
import { EventPublisher } from '@bigcapital/server/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@bigcapital/server/services/Tenancy/TenancyService';
import UnitOfWork from '@bigcapital/server/services/UnitOfWork';
import events from '@bigcapital/server/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import BaseVendorCredit from './BaseVendorCredit';
import { ERRORS } from './constants';

@Service()
export default class DeleteVendorCredit extends BaseVendorCredit {
  @Inject()
  uow: UnitOfWork;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject()
  tenancy: HasTenancyService;

  /**
   * Deletes the given vendor credit.
   * @param {number} tenantId - Tenant id.
   * @param {number} vendorCreditId - Vendor credit id.
   */
  public deleteVendorCredit = async (tenantId: number, vendorCreditId: number) => {
    const { VendorCredit, ItemEntry } = this.tenancy.models(tenantId);

    // Retrieve the old vendor credit.
    const oldVendorCredit = await this.getVendorCreditOrThrowError(tenantId, vendorCreditId);
    // Validates vendor credit has no associate refund transactions.
    await this.validateVendorCreditHasNoRefundTransactions(tenantId, vendorCreditId);
    // Validates vendor credit has no associated applied to bills transactions.
    await this.validateVendorCreditHasNoApplyBillsTransactions(tenantId, vendorCreditId);
    // Deletes the vendor credit transactions under UOW envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onVendorCreditEditing` event.
      await this.eventPublisher.emitAsync(events.vendorCredit.onDeleting, {
        tenantId,
        oldVendorCredit,
        trx,
      } as IVendorCreditDeletingPayload);

      // Deletes the associated credit note entries.
      await ItemEntry.query(trx).where('reference_id', vendorCreditId).where('reference_type', 'VendorCredit').delete();

      // Deletes the credit note transaction.
      await VendorCredit.query(trx).findById(vendorCreditId).delete();

      // Triggers `onVendorCreditDeleted` event.
      await this.eventPublisher.emitAsync(events.vendorCredit.onDeleted, {
        tenantId,
        vendorCreditId,
        oldVendorCredit,
        trx,
      } as IVendorCreditDeletedPayload);
    });
  };

  /**
   * Validates vendor credit has no refund transactions.
   * @param {number} tenantId
   * @param {number} vendorCreditId
   */
  private validateVendorCreditHasNoRefundTransactions = async (
    tenantId: number,
    vendorCreditId: number,
  ): Promise<void> => {
    const { RefundVendorCredit } = this.tenancy.models(tenantId);

    const refundCredits = await RefundVendorCredit.query().where('vendorCreditId', vendorCreditId);
    if (refundCredits.length > 0) {
      throw new ServiceError(ERRORS.VENDOR_CREDIT_HAS_REFUND_TRANSACTIONS);
    }
  };

  /**
   * Validate vendor credit has no applied transactions to bills.
   * @param {number} tenantId
   * @param {number} vendorCreditId
   */
  private validateVendorCreditHasNoApplyBillsTransactions = async (
    tenantId: number,
    vendorCreditId: number,
  ): Promise<void> => {
    const { VendorCreditAppliedBill } = this.tenancy.models(tenantId);

    const appliedTransactions = await VendorCreditAppliedBill.query().where('vendorCreditId', vendorCreditId);
    if (appliedTransactions.length > 0) {
      throw new ServiceError(ERRORS.VENDOR_CREDIT_HAS_APPLIED_BILLS);
    }
  };
}
