import {
  ISaleReceipt,
  ISaleReceiptCreatedPayload,
  ISaleReceiptCreatingPayload,
  ISaleReceiptDTO,
} from '@bigcapital/libs-backend';
import { EventPublisher } from '@bigcapital/server/lib/EventPublisher/EventPublisher';
import ItemsEntriesService from '@bigcapital/server/services/Items/ItemsEntriesService';
import TenancyService from '@bigcapital/server/services/Tenancy/TenancyService';
import UnitOfWork from '@bigcapital/server/services/UnitOfWork';
import events from '@bigcapital/server/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { SaleReceiptDTOTransformer } from './SaleReceiptDTOTransformer';
import { SaleReceiptValidators } from './SaleReceiptValidators';

@Service()
export class CreateSaleReceipt {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private transformer: SaleReceiptDTOTransformer;

  @Inject()
  private validators: SaleReceiptValidators;

  /**
   * Creates a new sale receipt with associated entries.
   * @async
   * @param {ISaleReceipt} saleReceipt
   * @return {Object}
   */
  public async createSaleReceipt(
    tenantId: number,
    saleReceiptDTO: ISaleReceiptDTO,
    trx?: Knex.Transaction,
  ): Promise<ISaleReceipt> {
    const { SaleReceipt, Contact } = this.tenancy.models(tenantId);

    // Retireves the payment customer model.
    const paymentCustomer = await Contact.query()
      .modify('customer')
      .findById(saleReceiptDTO.customerId)
      .throwIfNotFound();

    // Transform sale receipt DTO to model.
    const saleReceiptObj = await this.transformer.transformDTOToModel(tenantId, saleReceiptDTO, paymentCustomer);
    // Validate receipt deposit account existance and type.
    await this.validators.validateReceiptDepositAccountExistance(tenantId, saleReceiptDTO.depositAccountId);
    // Validate items IDs existance on the storage.
    await this.itemsEntriesService.validateItemsIdsExistance(tenantId, saleReceiptDTO.entries);
    // Validate the sellable items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(tenantId, saleReceiptDTO.entries);
    // Validate sale receipt number uniuqiness.
    if (saleReceiptDTO.receiptNumber) {
      await this.validators.validateReceiptNumberUnique(tenantId, saleReceiptDTO.receiptNumber);
    }
    // Creates a sale receipt transaction and associated transactions under UOW env.
    return this.uow.withTransaction(
      tenantId,
      async (trx: Knex.Transaction) => {
        // Triggers `onSaleReceiptCreating` event.
        await this.eventPublisher.emitAsync(events.saleReceipt.onCreating, {
          saleReceiptDTO,
          tenantId,
          trx,
        } as ISaleReceiptCreatingPayload);

        // Inserts the sale receipt graph to the storage.
        const saleReceipt = await SaleReceipt.query().upsertGraph({
          ...saleReceiptObj,
        });
        // Triggers `onSaleReceiptCreated` event.
        await this.eventPublisher.emitAsync(events.saleReceipt.onCreated, {
          tenantId,
          saleReceipt,
          saleReceiptId: saleReceipt.id,
          trx,
        } as ISaleReceiptCreatedPayload);

        return saleReceipt;
      },
      trx,
    );
  }
}
