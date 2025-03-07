import { IWarehousesActivatedPayload } from '@bigcapital/libs-backend';
import events from '@bigcapital/server/subscribers/events';
import { Inject, Service } from 'typedi';
import { VendorCreditActivateWarehouses } from '../../Activate/VendorCreditWarehousesActivate';

@Service()
export class VendorCreditsActivateWarehousesSubscriber {
  @Inject()
  private creditsActivateWarehouses: VendorCreditActivateWarehouses;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(events.warehouse.onActivated, this.updateCreditsWithWarehouseOnActivated);
    return bus;
  }

  /**
   * Updates all inventory transactions with the primary warehouse once
   * multi-warehouses feature is activated.
   * @param {IWarehousesActivatedPayload}
   */
  private updateCreditsWithWarehouseOnActivated = async ({
    tenantId,
    primaryWarehouse,
  }: IWarehousesActivatedPayload) => {
    await this.creditsActivateWarehouses.updateCreditsWithWarehouse(tenantId, primaryWarehouse);
  };
}
