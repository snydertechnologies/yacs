import { ISaleReceiptDTO } from '@bigcapital/libs-backend';
import { Importable } from '@bigcapital/server/services/Import/Importable';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { CreateSaleReceipt } from './CreateSaleReceipt';
import { SaleReceiptsSampleData } from './constants';

@Service()
export class SaleReceiptsImportable extends Importable {
  @Inject()
  private createReceiptService: CreateSaleReceipt;

  /**
   * Importing to sale receipts service.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} createAccountDTO
   * @returns
   */
  public importable(tenantId: number, createAccountDTO: ISaleReceiptDTO, trx?: Knex.Transaction) {
    return this.createReceiptService.createSaleReceipt(tenantId, createAccountDTO, trx);
  }

  /**
   * Concurrrency controlling of the importing process.
   * @returns {number}
   */
  public get concurrency() {
    return 1;
  }

  /**
   * Retrieves the sample data that used to download accounts sample sheet.
   */
  public sampleData(): any[] {
    return SaleReceiptsSampleData;
  }
}
