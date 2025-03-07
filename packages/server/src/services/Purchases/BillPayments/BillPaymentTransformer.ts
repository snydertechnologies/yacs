import { IBillPayment } from '@bigcapital/libs-backend';
import { Transformer } from '@bigcapital/server/lib/Transformer/Transformer';
import { formatNumber } from '@bigcapital/server/utils';
import { BillPaymentEntryTransformer } from './BillPaymentEntryTransformer';

export class BillPaymentTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['formattedPaymentDate', 'formattedAmount', 'entries'];
  };

  /**
   * Retrieve formatted invoice date.
   * @param {IBill} invoice
   * @returns {String}
   */
  protected formattedPaymentDate = (billPayment: IBillPayment): string => {
    return this.formatDate(billPayment.paymentDate);
  };

  /**
   * Retrieve formatted bill amount.
   * @param {IBill} invoice
   * @returns {string}
   */
  protected formattedAmount = (billPayment: IBillPayment): string => {
    return formatNumber(billPayment.amount, {
      currencyCode: billPayment.currencyCode,
    });
  };

  /**
   * Retreives the bill payment entries.
   */
  protected entries = (billPayment) => {
    return this.item(billPayment.entries, new BillPaymentEntryTransformer());
  };
}
