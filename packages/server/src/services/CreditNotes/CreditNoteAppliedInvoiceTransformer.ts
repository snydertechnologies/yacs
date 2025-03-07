import { Transformer } from '@bigcapital/server/lib/Transformer/Transformer';
import { formatNumber } from '@bigcapital/server/utils';

export class CreditNoteAppliedInvoiceTransformer extends Transformer {
  /**
   * Includeded attributes.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return [
      'formttedAmount',
      'creditNoteNumber',
      'creditNoteDate',
      'invoiceNumber',
      'invoiceReferenceNo',
      'formattedCreditNoteDate',
    ];
  };

  /**
   * Exclude attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return ['saleInvoice', 'creditNote'];
  };

  formttedAmount = (item) => {
    return formatNumber(item.amount, {
      currencyCode: item.creditNote.currencyCode,
    });
  };

  creditNoteNumber = (item) => {
    return item.creditNote.creditNoteNumber;
  };

  creditNoteDate = (item) => {
    return item.creditNote.creditNoteDate;
  };

  invoiceNumber = (item) => {
    return item.saleInvoice.invoiceNo;
  };

  invoiceReferenceNo = (item) => {
    return item.saleInvoice.referenceNo;
  };

  formattedCreditNoteDate = (item) => {
    return this.formatDate(item.creditNote.creditNoteDate);
  };
}
