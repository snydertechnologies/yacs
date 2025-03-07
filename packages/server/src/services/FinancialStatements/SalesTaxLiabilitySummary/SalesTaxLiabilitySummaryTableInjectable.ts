import { ISalesTaxLiabilitySummaryTable, SalesTaxLiabilitySummaryQuery } from '@bigcapital/libs-backend';
import { Inject, Service } from 'typedi';
import { SalesTaxLiabilitySummaryService } from './SalesTaxLiabilitySummaryService';
import { SalesTaxLiabilitySummaryTable } from './SalesTaxLiabilitySummaryTable';

@Service()
export class SalesTaxLiabilitySummaryTableInjectable {
  @Inject()
  private salesTaxLiability: SalesTaxLiabilitySummaryService;

  /**
   * Retrieve sales tax liability summary table.
   * @param {number} tenantId
   * @param {SalesTaxLiabilitySummaryQuery} query
   * @returns {Promise<ISalesTaxLiabilitySummaryTable>}
   */
  public async table(tenantId: number, query: SalesTaxLiabilitySummaryQuery): Promise<ISalesTaxLiabilitySummaryTable> {
    const report = await this.salesTaxLiability.salesTaxLiability(tenantId, query);
    // Creates the sales tax liability summary table.
    const table = new SalesTaxLiabilitySummaryTable(report.data, query);

    return {
      table: {
        rows: table.tableRows(),
        columns: table.tableColumns(),
      },
      query: report.query,
      meta: report.meta,
    };
  }
}
