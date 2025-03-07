import { ICustomer, ISaleEstimate, ISaleEstimateDTO } from '@bigcapital/libs-backend';
import { BranchTransactionDTOTransform } from '@bigcapital/server/services/Branches/Integrations/BranchTransactionDTOTransform';
import HasTenancyService from '@bigcapital/server/services/Tenancy/TenancyService';
import { WarehouseTransactionDTOTransform } from '@bigcapital/server/services/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { formatDateFields } from '@bigcapital/server/utils';
import { omit, sumBy } from 'lodash';
import moment from 'moment';
import * as R from 'ramda';
import { Inject, Service } from 'typedi';
import { SaleEstimateIncrement } from './SaleEstimateIncrement';
import { SaleEstimateValidators } from './SaleEstimateValidators';

@Service()
export class SaleEstimateDTOTransformer {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private validators: SaleEstimateValidators;

  @Inject()
  private branchDTOTransform: BranchTransactionDTOTransform;

  @Inject()
  private warehouseDTOTransform: WarehouseTransactionDTOTransform;

  @Inject()
  private estimateIncrement: SaleEstimateIncrement;

  /**
   * Transform create DTO object ot model object.
   * @param  {number} tenantId
   * @param  {ISaleEstimateDTO} saleEstimateDTO - Sale estimate DTO.
   * @return {ISaleEstimate}
   */
  async transformDTOToModel(
    tenantId: number,
    estimateDTO: ISaleEstimateDTO,
    paymentCustomer: ICustomer,
    oldSaleEstimate?: ISaleEstimate,
  ): Promise<ISaleEstimate> {
    const { ItemEntry, Contact } = this.tenancy.models(tenantId);

    const amount = sumBy(estimateDTO.entries, (e) => ItemEntry.calcAmount(e));

    // Retreive the next invoice number.
    const autoNextNumber = this.estimateIncrement.getNextEstimateNumber(tenantId);

    // Retreive the next estimate number.
    const estimateNumber = estimateDTO.estimateNumber || oldSaleEstimate?.estimateNumber || autoNextNumber;

    // Validate the sale estimate number require.
    this.validators.validateEstimateNoRequire(estimateNumber);

    const initialDTO = {
      amount,
      ...formatDateFields(omit(estimateDTO, ['delivered', 'entries']), ['estimateDate', 'expirationDate']),
      currencyCode: paymentCustomer.currencyCode,
      exchangeRate: estimateDTO.exchangeRate || 1,
      ...(estimateNumber ? { estimateNumber } : {}),
      entries: estimateDTO.entries.map((entry) => ({
        reference_type: 'SaleEstimate',
        ...entry,
      })),
      // Avoid rewrite the deliver date in edit mode when already published.
      ...(estimateDTO.delivered &&
        !oldSaleEstimate?.deliveredAt && {
          deliveredAt: moment().toMySqlDateTime(),
        }),
    };
    return R.compose(
      this.branchDTOTransform.transformDTO<ISaleEstimate>(tenantId),
      this.warehouseDTOTransform.transformDTO<ISaleEstimate>(tenantId),
    )(initialDTO);
  }

  /**
   * Retrieve estimate number to object model.
   * @param {number} tenantId
   * @param {ISaleEstimateDTO} saleEstimateDTO
   * @param {ISaleEstimate} oldSaleEstimate
   */
  public transformEstimateNumberToModel(
    tenantId: number,
    saleEstimateDTO: ISaleEstimateDTO,
    oldSaleEstimate?: ISaleEstimate,
  ): string {
    // Retreive the next invoice number.
    const autoNextNumber = this.estimateIncrement.getNextEstimateNumber(tenantId);

    if (saleEstimateDTO.estimateNumber) {
      return saleEstimateDTO.estimateNumber;
    }
    return oldSaleEstimate ? oldSaleEstimate.estimateNumber : autoNextNumber;
  }
}
