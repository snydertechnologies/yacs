import { IARAgingSummaryQuery } from '@bigcapital/libs-backend';
import { TableSheet } from '@bigcapital/server/lib/Xlsx/TableSheet';
import { Inject, Service } from 'typedi';
import { ARAgingSummaryTableInjectable } from './ARAgingSummaryTableInjectable';

@Service()
export class ARAgingSummaryExportInjectable {
  @Inject()
  private ARAgingSummaryTable: ARAgingSummaryTableInjectable;

  /**
   * Retrieves the A/R aging summary sheet in XLSX format.
   * @param {number} tenantId
   * @param {IARAgingSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(tenantId: number, query: IARAgingSummaryQuery): Promise<Buffer> {
    const table = await this.ARAgingSummaryTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the A/R aging summary sheet in CSV format.
   * @param {number} tenantId
   * @param {ICashFlowStatementQuery} query
   * @returns {Promise<string>}
   */
  public async csv(tenantId: number, query: IARAgingSummaryQuery): Promise<string> {
    const table = await this.ARAgingSummaryTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
