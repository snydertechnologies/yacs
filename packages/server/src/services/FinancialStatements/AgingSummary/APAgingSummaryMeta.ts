import { IAgingSummaryMeta, IAgingSummaryQuery } from '@bigcapital/libs-backend';
import { Inject, Service } from 'typedi';
import { AgingSummaryMeta } from './AgingSummaryMeta';

@Service()
export class APAgingSummaryMeta {
  @Inject()
  private agingSummaryMeta: AgingSummaryMeta;

  /**
   * Retrieve the aging summary meta.
   * @param {number} tenantId -
   * @returns {IBalanceSheetMeta}
   */
  public async meta(tenantId: number, query: IAgingSummaryQuery): Promise<IAgingSummaryMeta> {
    const commonMeta = await this.agingSummaryMeta.meta(tenantId, query);

    return {
      ...commonMeta,
      sheetName: 'A/P Aging Summary',
    };
  }
}
