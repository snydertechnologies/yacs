import { ISaleInvoiceWriteoffCreatePayload, ISaleInvoiceWrittenOffCanceledPayload } from '@bigcapital/libs-backend';
import events from '@bigcapital/server/subscribers/events';
import { Inject, Service } from 'typedi';
import { SaleInvoiceWriteoffGLStorage } from './SaleInvoiceWriteoffGLStorage';

@Service()
export default class SaleInvoiceWriteoffSubscriber {
  @Inject()
  writeGLStorage: SaleInvoiceWriteoffGLStorage;

  /**
   * Attaches events.
   */
  public attach(bus) {
    bus.subscribe(events.saleInvoice.onWrittenoff, this.writeJournalEntriesOnceWriteoffCreate);
    bus.subscribe(events.saleInvoice.onWrittenoffCanceled, this.revertJournalEntriesOnce);
  }
  /**
   * Write the written-off sale invoice journal entries.
   * @param {ISaleInvoiceWriteoffCreatePayload}
   */
  private writeJournalEntriesOnceWriteoffCreate = async ({
    tenantId,
    saleInvoice,
    trx,
  }: ISaleInvoiceWriteoffCreatePayload) => {
    await this.writeGLStorage.writeInvoiceWriteoffEntries(tenantId, saleInvoice.id, trx);
  };

  /**
   * Reverts the written-of sale invoice jounral entries.
   * @param {ISaleInvoiceWrittenOffCanceledPayload}
   */
  private revertJournalEntriesOnce = async ({ tenantId, saleInvoice, trx }: ISaleInvoiceWrittenOffCanceledPayload) => {
    await this.writeGLStorage.revertInvoiceWriteoffEntries(tenantId, saleInvoice.id, trx);
  };
}
