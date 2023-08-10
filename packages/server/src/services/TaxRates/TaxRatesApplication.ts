import { Inject, Service } from 'typedi';
import { ICreateTaxRateDTO, IEditTaxRateDTO } from '@/interfaces';
import { CreateTaxRate } from './CreateTaxRate';
import { DeleteTaxRateService } from './DeleteTaxRate';
import { EditTaxRateService } from './EditTaxRate';
import { GetTaxRateService } from './GetTaxRate';
import { GetTaxRatesService } from './GetTaxRates';

@Service()
export class TaxRatesApplication {
  @Inject()
  private createTaxRateService: CreateTaxRate;

  @Inject()
  private editTaxRateService: EditTaxRateService;

  @Inject()
  private deleteTaxRateService: DeleteTaxRateService;

  @Inject()
  private getTaxRateService: GetTaxRateService;

  @Inject()
  private getTaxRatesService: GetTaxRatesService;

  /**
   * Creates a new tax rate.
   * @param {number} tenantId
   * @param {ICreateTaxRateDTO} createTaxRateDTO
   * @returns
   */
  public createTaxRate(tenantId: number, createTaxRateDTO: ICreateTaxRateDTO) {
    return this.createTaxRateService.createTaxRate(tenantId, createTaxRateDTO);
  }

  /**
   * Edits the given tax rate.
   * @param {number} tenantId
   * @param {number} taxRateId
   * @param {IEditTaxRateDTO} taxRateEditDTO
   */
  public editTaxRate(
    tenantId: number,
    taxRateId: number,
    editTaxRateDTO: IEditTaxRateDTO
  ) {
    return this.editTaxRateService.editTaxRate(
      tenantId,
      taxRateId,
      editTaxRateDTO
    );
  }

  /**
   * Deletes the given tax rate.
   * @param {number} tenantId
   * @param {number} taxRateId
   * @returns {Promise<void>}
   */
  public deleteTaxRate(tenantId: number, taxRateId: number) {
    return this.deleteTaxRateService.deleteTaxRate(tenantId, taxRateId);
  }

  /**
   * Retrieves the given tax rate.
   * @param {number} tenantId
   * @param {number} taxRateId
   * @returns
   */
  public getTaxRate(tenantId: number, taxRateId: number) {
    return this.getTaxRateService.getTaxRate(tenantId, taxRateId);
  }

  /**
   * Retrieves the tax rates list.
   * @param {number} tenantId
   * @returns
   */
  public getTaxRates(tenantId: number) {
    return this.getTaxRatesService.getTaxRates(tenantId);
  }
}
