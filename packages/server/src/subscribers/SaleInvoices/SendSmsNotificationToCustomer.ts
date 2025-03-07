import { ISaleInvoiceCreatedPayload } from '@bigcapital/libs-backend';
import { SaleInvoiceNotifyBySms } from '@bigcapital/server/services/Sales/Invoices/SaleInvoiceNotifyBySms';
import { runAfterTransaction } from '@bigcapital/server/services/UnitOfWork/TransactionsHooks';
import events from '@bigcapital/server/subscribers/events';
import { Inject, Service } from 'typedi';

@Service()
export default class SendSmsNotificationToCustomer {
  @Inject()
  private saleInvoiceNotifyBySms: SaleInvoiceNotifyBySms;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(events.saleInvoice.onCreated, this.sendSmsNotificationAfterInvoiceCreation);
  }

  /**
   * Hnadle sending SMS notification after invoice transaction creation.
   */
  private sendSmsNotificationAfterInvoiceCreation = async ({
    tenantId,
    saleInvoiceId,
    saleInvoice,
    trx,
  }: ISaleInvoiceCreatedPayload) => {
    // Can't continue if the sale invoice is not marked as delivered.
    if (!saleInvoice.deliveredAt) return;

    // Notify via sms after transactions complete running.
    runAfterTransaction(trx, async () => {
      try {
        await this.saleInvoiceNotifyBySms.notifyDetailsBySmsAfterCreation(tenantId, saleInvoiceId);
      } catch (error) {}
    });
  };
}
