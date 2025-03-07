import { ITrialBalanceSheetQuery } from '@bigcapital/libs-backend';
import { TableSheet } from '@bigcapital/server/lib/Xlsx/TableSheet';
import { Inject, Service } from 'typedi';
import { TrialBalanceSheetPdfInjectable } from './TrialBalanceSheetPdfInjectsable';
import { TrialBalanceSheetTableInjectable } from './TrialBalanceSheetTableInjectable';

@Service()
export class TrialBalanceExportInjectable {
  @Inject()
  private trialBalanceSheetTable: TrialBalanceSheetTableInjectable;

  @Inject()
  private trialBalanceSheetPdf: TrialBalanceSheetPdfInjectable;

  /**
   * Retrieves the trial balance sheet in XLSX format.
   * @param {number} tenantId
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(tenantId: number, query: ITrialBalanceSheetQuery) {
    const table = await this.trialBalanceSheetTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the trial balance sheet in CSV format.
   * @param {number} tenantId
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async csv(tenantId: number, query: ITrialBalanceSheetQuery): Promise<string> {
    const table = await this.trialBalanceSheetTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }

  /**
   * Retrieves the trial balance sheet in PDF format.
   * @param {number} tenantId
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async pdf(tenantId: number, query: ITrialBalanceSheetQuery): Promise<Buffer> {
    return this.trialBalanceSheetPdf.pdf(tenantId, query);
  }
}
