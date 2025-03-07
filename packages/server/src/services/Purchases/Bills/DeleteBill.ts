import { IBIllEventDeletedPayload, IBillEventDeletingPayload } from '@bigcapital/libs-backend';
import { EventPublisher } from '@bigcapital/server/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@bigcapital/server/services/Tenancy/TenancyService';
import UnitOfWork from '@bigcapital/server/services/UnitOfWork';
import events from '@bigcapital/server/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { BillsValidators } from './BillsValidators';

@Service()
export class DeleteBill {
  @Inject()
  private validators: BillsValidators;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Deletes the bill with associated entries.
   * @param {number} billId
   * @return {void}
   */
  public async deleteBill(tenantId: number, billId: number) {
    const { ItemEntry, Bill } = this.tenancy.models(tenantId);

    // Retrieve the given bill or throw not found error.
    const oldBill = await Bill.query().findById(billId).withGraphFetched('entries');

    // Validates the bill existance.
    this.validators.validateBillExistance(oldBill);

    // Validate the givne bill has no associated landed cost transactions.
    await this.validators.validateBillHasNoLandedCost(tenantId, billId);

    // Validate the purchase bill has no associated payments transactions.
    await this.validators.validateBillHasNoEntries(tenantId, billId);

    // Validate the given bill has no associated reconciled with vendor credits.
    await this.validators.validateBillHasNoAppliedToCredit(tenantId, billId);

    // Deletes bill transaction with associated transactions under
    // unit-of-work envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onBillDeleting` event.
      await this.eventPublisher.emitAsync(events.bill.onDeleting, {
        trx,
        tenantId,
        oldBill,
      } as IBillEventDeletingPayload);

      // Delete all associated bill entries.
      await ItemEntry.query(trx).where('reference_type', 'Bill').where('reference_id', billId).delete();

      // Delete the bill transaction.
      await Bill.query(trx).findById(billId).delete();

      // Triggers `onBillDeleted` event.
      await this.eventPublisher.emitAsync(events.bill.onDeleted, {
        tenantId,
        billId,
        oldBill,
        trx,
      } as IBIllEventDeletedPayload);
    });
  }
}
