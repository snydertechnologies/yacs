import { IManualJournalDTO } from '@bigcapital/libs-backend';
import { Knex } from 'knex';
import { Inject } from 'typedi';
import * as Yup from 'yup';
import { Importable } from '../Import/Importable';
import { ImportableContext } from '../Import/interfaces';
import { CreateManualJournalService } from './CreateManualJournal';
import { ManualJournalsSampleData } from './constants';

export class ManualJournalImportable extends Importable {
  @Inject()
  private createManualJournalService: CreateManualJournalService;

  /**
   * Importing to account service.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} createAccountDTO
   * @returns
   */
  public importable(tenantId: number, createJournalDTO: IManualJournalDTO, trx?: Knex.Transaction) {
    return this.createManualJournalService.makeJournalEntries(tenantId, createJournalDTO, {}, trx);
  }

  /**
   * Transformes the DTO before passing it to importable and validation.
   * @param {Record<string, any>} createDTO
   * @param {ImportableContext} context
   * @returns {Record<string, any>}
   */
  public transform(createDTO: Record<string, any>, context: ImportableContext) {
    return createDTO;
  }

  /**
   * Params validation schema.
   * @returns {ValidationSchema[]}
   */
  public paramsValidationSchema() {
    return Yup.object().shape({
      autoIncrement: Yup.boolean(),
    });
  }

  /**
   * Retrieves the sample data of manual journals that used to download sample sheet.
   * @returns {Record<string, any>}
   */
  public sampleData(): Record<string, any>[] {
    return ManualJournalsSampleData;
  }
}
