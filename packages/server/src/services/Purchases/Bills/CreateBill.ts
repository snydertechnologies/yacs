import { IBill, IBillCreatedPayload, IBillCreatingPayload, IBillDTO, ISystemUser } from '@bigcapital/libs-backend';
import { EventPublisher } from '@bigcapital/server/lib/EventPublisher/EventPublisher';
import ItemsEntriesService from '@bigcapital/server/services/Items/ItemsEntriesService';
import HasTenancyService from '@bigcapital/server/services/Tenancy/TenancyService';
import UnitOfWork from '@bigcapital/server/services/UnitOfWork';
import events from '@bigcapital/server/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { BillDTOTransformer } from './BillDTOTransformer';
import { BillsValidators } from './BillsValidators';

@Service()
export class CreateBill {
  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private validators: BillsValidators;

  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  @Inject()
  private transformerDTO: BillDTOTransformer;

  /**
   * Creates a new bill and stored it to the storage.
   * ----
   * Precedures.
   * ----
   * - Insert bill transactions to the storage.
   * - Insert bill entries to the storage.
   * - Increment the given vendor id.
   * - Record bill journal transactions on the given accounts.
   * - Record bill items inventory transactions.
   * ----
   * @param  {number} tenantId - The given tenant id.
   * @param  {IBillDTO} billDTO -
   * @return {Promise<IBill>}
   */
  public async createBill(
    tenantId: number,
    billDTO: IBillDTO,
    authorizedUser: ISystemUser,
    trx?: Knex.Transaction,
  ): Promise<IBill> {
    const { Bill, Contact } = this.tenancy.models(tenantId);

    // Retrieves the given bill vendor or throw not found error.
    const vendor = await Contact.query().modify('vendor').findById(billDTO.vendorId).throwIfNotFound();

    // Validate the bill number uniqiness on the storage.
    await this.validators.validateBillNumberExists(tenantId, billDTO.billNumber);
    // Validate items IDs existance.
    await this.itemsEntriesService.validateItemsIdsExistance(tenantId, billDTO.entries);
    // Validate non-purchasable items.
    await this.itemsEntriesService.validateNonPurchasableEntriesItems(tenantId, billDTO.entries);
    // Validates the cost entries should be with inventory items.
    await this.validators.validateCostEntriesShouldBeInventoryItems(tenantId, billDTO.entries);
    // Transform the bill DTO to model object.
    const billObj = await this.transformerDTO.billDTOToModel(tenantId, billDTO, vendor, authorizedUser);
    // Write new bill transaction with associated transactions under UOW env.
    return this.uow.withTransaction(
      tenantId,
      async (trx: Knex.Transaction) => {
        // Triggers `onBillCreating` event.
        await this.eventPublisher.emitAsync(events.bill.onCreating, {
          trx,
          billDTO,
          tenantId,
        } as IBillCreatingPayload);

        // Inserts the bill graph object to the storage.
        const bill = await Bill.query(trx).upsertGraph(billObj);

        // Triggers `onBillCreated` event.
        await this.eventPublisher.emitAsync(events.bill.onCreated, {
          tenantId,
          bill,
          billId: bill.id,
          trx,
        } as IBillCreatedPayload);

        return bill;
      },
      trx,
    );
  }
}
