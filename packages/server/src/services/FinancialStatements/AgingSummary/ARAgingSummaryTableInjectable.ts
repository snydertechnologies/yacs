import { IARAgingSummaryQuery, IARAgingSummaryTable } from '@bigcapital/libs-backend';
import { Inject, Service } from 'typedi';
import ARAgingSummaryService from './ARAgingSummaryService';
import ARAgingSummaryTable from './ARAgingSummaryTable';

@Service()
export class ARAgingSummaryTableInjectable {
  @Inject()
  private ARAgingSummarySheet: ARAgingSummaryService;

  /**
   * Retrieves A/R aging summary in table format.
   * @param {number} tenantId
   * @param {IARAgingSummaryQuery} query
   * @returns {Promise<IARAgingSummaryTable>}
   */
  public async table(tenantId: number, query: IARAgingSummaryQuery): Promise<IARAgingSummaryTable> {
    const report = await this.ARAgingSummarySheet.ARAgingSummary(tenantId, query);
    const table = new ARAgingSummaryTable(report.data, query, {});

    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableRows(),
      },
      meta: report.meta,
      query,
    };
  }
}
