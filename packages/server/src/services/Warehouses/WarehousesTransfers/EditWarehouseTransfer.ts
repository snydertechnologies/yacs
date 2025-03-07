import {
  IEditWarehouseTransferDTO,
  IWarehouseTransfer,
  IWarehouseTransferEditPayload,
  IWarehouseTransferEditedPayload,
} from '@bigcapital/libs-backend';
import { EventPublisher } from '@bigcapital/server/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@bigcapital/server/services/Tenancy/TenancyService';
import UnitOfWork from '@bigcapital/server/services/UnitOfWork';
import events from '@bigcapital/server/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { CommandWarehouseTransfer } from './CommandWarehouseTransfer';

@Service()
export class EditWarehouseTransfer extends CommandWarehouseTransfer {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  uow: UnitOfWork;

  @Inject()
  eventPublisher: EventPublisher;

  /**
   * Edits warehouse transfer.
   * @param   {number} tenantId
   * @param   {number} warehouseTransferId
   * @param   {IEditWarehouseTransferDTO} editWarehouseDTO
   * @returns {Promise<IWarehouseTransfer>}
   */
  public editWarehouseTransfer = async (
    tenantId: number,
    warehouseTransferId: number,
    editWarehouseDTO: IEditWarehouseTransferDTO,
  ): Promise<IWarehouseTransfer> => {
    const { WarehouseTransfer } = this.tenancy.models(tenantId);

    // Retrieves the old warehouse transfer transaction.
    const oldWarehouseTransfer = await WarehouseTransfer.query().findById(warehouseTransferId).throwIfNotFound();

    // Validate warehouse from and to should not be the same.
    this.validateWarehouseFromToNotSame(editWarehouseDTO);

    // Retrieves the from warehouse or throw not found service error.
    const fromWarehouse = await this.getFromWarehouseOrThrow(tenantId, editWarehouseDTO.fromWarehouseId);
    // Retrieves the to warehouse or throw not found service error.
    const toWarehouse = await this.getToWarehouseOrThrow(tenantId, editWarehouseDTO.toWarehouseId);
    // Validates the not found entries items ids.
    const items = await this.itemsEntries.validateItemsIdsExistance(tenantId, editWarehouseDTO.entries);
    // Validate the items entries should be inventory type.
    this.validateItemsShouldBeInventory(items);

    // Edits warehouse transfer transaction under unit-of-work envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onWarehouseTransferEdit` event.
      await this.eventPublisher.emitAsync(events.warehouseTransfer.onEdit, {
        tenantId,
        editWarehouseDTO,
        oldWarehouseTransfer,
        trx,
      } as IWarehouseTransferEditPayload);

      // Updates warehouse transfer graph on the storage.
      const warehouseTransfer = await WarehouseTransfer.query(trx).upsertGraphAndFetch({
        id: warehouseTransferId,
        ...editWarehouseDTO,
      });
      // Triggers `onWarehouseTransferEdit` event
      await this.eventPublisher.emitAsync(events.warehouseTransfer.onEdited, {
        tenantId,
        editWarehouseDTO,
        warehouseTransfer,
        oldWarehouseTransfer,
        trx,
      } as IWarehouseTransferEditedPayload);

      return warehouseTransfer;
    });
  };
}
