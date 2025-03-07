import { ICustomer, ISaleReceipt, ISaleReceiptDTO } from '@bigcapital/libs-backend';
import { ItemEntry } from '@bigcapital/server/models';
import { BranchTransactionDTOTransform } from '@bigcapital/server/services/Branches/Integrations/BranchTransactionDTOTransform';
import ItemsEntriesService from '@bigcapital/server/services/Items/ItemsEntriesService';
import { WarehouseTransactionDTOTransform } from '@bigcapital/server/services/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { formatDateFields } from '@bigcapital/server/utils';
import composeAsync from 'async/compose';
import { omit, sumBy } from 'lodash';
import moment from 'moment';
import * as R from 'ramda';
import { Inject, Service } from 'typedi';
import { SaleReceiptIncrement } from './SaleReceiptIncrement';
import { SaleReceiptValidators } from './SaleReceiptValidators';

@Service()
export class SaleReceiptDTOTransformer {
  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  @Inject()
  private warehouseDTOTransform: WarehouseTransactionDTOTransform;

  @Inject()
  private validators: SaleReceiptValidators;

  @Inject()
  private receiptIncrement: SaleReceiptIncrement;

  /**
   * Transform create DTO object to model object.
   * @param {ISaleReceiptDTO} saleReceiptDTO -
   * @param {ISaleReceipt} oldSaleReceipt -
   * @returns {ISaleReceipt}
   */
  async transformDTOToModel(
    tenantId: number,
    saleReceiptDTO: ISaleReceiptDTO,
    paymentCustomer: ICustomer,
    oldSaleReceipt?: ISaleReceipt,
  ): Promise<ISaleReceipt> {
    const amount = sumBy(saleReceiptDTO.entries, (e) => ItemEntry.calcAmount(e));
    // Retreive the next invoice number.
    const autoNextNumber = this.receiptIncrement.getNextReceiptNumber(tenantId);

    // Retreive the receipt number.
    const receiptNumber = saleReceiptDTO.receiptNumber || oldSaleReceipt?.receiptNumber || autoNextNumber;

    // Validate receipt number require.
    this.validators.validateReceiptNoRequire(receiptNumber);

    const initialEntries = saleReceiptDTO.entries.map((entry) => ({
      reference_type: 'SaleReceipt',
      ...entry,
    }));

    const entries = await composeAsync(
      // Sets default cost and sell account to receipt items entries.
      this.itemsEntriesService.setItemsEntriesDefaultAccounts(tenantId),
    )(initialEntries);

    const initialDTO = {
      amount,
      ...formatDateFields(omit(saleReceiptDTO, ['closed', 'entries']), ['receiptDate']),
      currencyCode: paymentCustomer.currencyCode,
      exchangeRate: saleReceiptDTO.exchangeRate || 1,
      receiptNumber,
      // Avoid rewrite the deliver date in edit mode when already published.
      ...(saleReceiptDTO.closed &&
        !oldSaleReceipt?.closedAt && {
          closedAt: moment().toMySqlDateTime(),
        }),
      entries,
    };
    return R.compose(
      this.branchDTOTransform.transformDTO<ISaleReceipt>(tenantId),
      this.warehouseDTOTransform.transformDTO<ISaleReceipt>(tenantId),
    )(initialDTO);
  }
}
