import { Transformer } from '@bigcapital/server/lib/Transformer/Transformer';
import { ExpenseCategory } from '@bigcapital/server/models';
import { formatNumber } from '@bigcapital/server/utils';

export class ExpenseCategoryTransformer extends Transformer {
  /**
   * Include these attributes to expense object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['amountFormatted'];
  };

  /**
   * Retrieves the formatted amount.
   * @param {ExpenseCategory} category
   * @returns {string}
   */
  protected amountFormatted(category: ExpenseCategory) {
    return formatNumber(category.amount, {
      currencyCode: this.context.currencyCode,
      money: false,
    });
  }
}
