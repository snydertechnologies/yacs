import { ICustomerNewDTO } from '@bigcapital/libs-backend';
import { Importable } from '@bigcapital/server/services/Import/Importable';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { CreateCustomer } from './CRUD/CreateCustomer';
import { CustomersSampleData } from './_SampleData';

@Service()
export class CustomersImportable extends Importable {
  @Inject()
  private createCustomerService: CreateCustomer;

  /**
   * Mapps the imported data to create a new customer service.
   * @param {number} tenantId
   * @param {ICustomerNewDTO} createDTO
   * @param {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  public async importable(
    tenantId: number,
    createDTO: ICustomerNewDTO,
    trx?: Knex.Transaction<any, any[]>,
  ): Promise<void> {
    await this.createCustomerService.createCustomer(tenantId, createDTO, trx);
  }

  /**
   * Retrieves the sample data of customers used to download sample sheet.
   */
  public sampleData(): any[] {
    return CustomersSampleData;
  }
}
