import { IBillPaymentDeletingPayload, IBillPaymentEventDeletedPayload } from '@bigcapital/libs-backend';
import { EventPublisher } from '@bigcapital/server/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@bigcapital/server/services/Tenancy/TenancyService';
import UnitOfWork from '@bigcapital/server/services/UnitOfWork';
import events from '@bigcapital/server/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';

@Service()
export class DeleteBillPayment {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Deletes the bill payment and associated transactions.
   * @param  {number} tenantId - Tenant id.
   * @param  {Integer} billPaymentId - The given bill payment id.
   * @return {Promise}
   */
  public async deleteBillPayment(tenantId: number, billPaymentId: number) {
    const { BillPayment, BillPaymentEntry } = this.tenancy.models(tenantId);

    // Retrieve the bill payment or throw not found service error.
    const oldBillPayment = await BillPayment.query()
      .withGraphFetched('entries')
      .findById(billPaymentId)
      .throwIfNotFound();

    // Deletes the bill transactions with associated transactions under
    // unit-of-work envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onBillPaymentDeleting` payload.
      await this.eventPublisher.emitAsync(events.billPayment.onDeleting, {
        tenantId,
        trx,
        oldBillPayment,
      } as IBillPaymentDeletingPayload);

      // Deletes the bill payment assocaited entries.
      await BillPaymentEntry.query(trx).where('bill_payment_id', billPaymentId).delete();

      // Deletes the bill payment transaction.
      await BillPayment.query(trx).where('id', billPaymentId).delete();

      // Triggers `onBillPaymentDeleted` event.
      await this.eventPublisher.emitAsync(events.billPayment.onDeleted, {
        tenantId,
        billPaymentId,
        oldBillPayment,
        trx,
      } as IBillPaymentEventDeletedPayload);
    });
  }
}
