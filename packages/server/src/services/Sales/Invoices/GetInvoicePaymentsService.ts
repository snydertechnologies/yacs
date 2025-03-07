import { TransformerInjectable } from '@bigcapital/server/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@bigcapital/server/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { InvoicePaymentTransactionTransformer } from './InvoicePaymentTransactionTransformer';

@Service()
export class GetInvoicePaymentsService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the invoice associated payments transactions.
   * @param {number} tenantId - Tenant id.
   * @param {number} invoiceId - Invoice id.
   */
  public getInvoicePayments = async (tenantId: number, invoiceId: number) => {
    const { PaymentReceiveEntry } = this.tenancy.models(tenantId);

    const paymentsEntries = await PaymentReceiveEntry.query()
      .where('invoiceId', invoiceId)
      .withGraphJoined('payment.depositAccount')
      .withGraphJoined('invoice')
      .orderBy('payment:paymentDate', 'ASC');

    return this.transformer.transform(tenantId, paymentsEntries, new InvoicePaymentTransactionTransformer());
  };
}
