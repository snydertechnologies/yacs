import { TransformerInjectable } from '@bigcapital/server/lib/Transformer/TransformerInjectable';
import { Inject, Service } from 'typedi';
import BaseVendorCredit from '../BaseVendorCredit';
import { VendorCreditAppliedBillTransformer } from './VendorCreditAppliedBillTransformer';

@Service()
export default class GetAppliedBillsToVendorCredit extends BaseVendorCredit {
  @Inject()
  private transformer: TransformerInjectable;

  /**
   *
   * @param {number} tenantId
   * @param {number} vendorCreditId
   * @returns
   */
  public getAppliedBills = async (tenantId: number, vendorCreditId: number) => {
    const { VendorCreditAppliedBill } = this.tenancy.models(tenantId);

    const vendorCredit = await this.getVendorCreditOrThrowError(tenantId, vendorCreditId);
    const appliedToBills = await VendorCreditAppliedBill.query()
      .where('vendorCreditId', vendorCreditId)
      .withGraphFetched('bill')
      .withGraphFetched('vendorCredit');

    // Transformes the models to POJO.
    return this.transformer.transform(tenantId, appliedToBills, new VendorCreditAppliedBillTransformer());
  };
}
