import { ICreditNotesQueryDTO } from '@bigcapital/libs-backend';
import { Exportable } from '@bigcapital/server/services/Export/Exportable';
import { Inject, Service } from 'typedi';
import ListCreditNotes from './ListCreditNotes';

@Service()
export class CreditNotesExportable extends Exportable {
  @Inject()
  private getCreditNotes: ListCreditNotes;

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {number} tenantId -
   * @param {IVendorCreditsQueryDTO} query -
   * @returns {}
   */
  public exportable(tenantId: number, query: ICreditNotesQueryDTO) {
    const parsedQuery = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      ...query,
      page: 1,
      pageSize: 12000,
    } as ICreditNotesQueryDTO;

    return this.getCreditNotes.getCreditNotesList(tenantId, parsedQuery).then((output) => output.creditNotes);
  }
}
