import { Transformer } from '@bigcapital/server/lib/Transformer/Transformer';
import { formatNumber } from '@bigcapital/server/utils';

export default class RefundCreditNoteTransformer extends Transformer {
  /**
   * Includeded attributes.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return ['formttedAmount', 'formattedDate'];
  };

  /**
   * Formatted amount.
   * @returns {string}
   */
  protected formttedAmount = (item) => {
    return formatNumber(item.amount, {
      currencyCode: item.currencyCode,
    });
  };

  /**
   * Formatted date.
   * @returns {string}
   */
  protected formattedDate = (item) => {
    return this.formatDate(item.date);
  };
}
