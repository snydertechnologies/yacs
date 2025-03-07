// @ts-nocheck
import React from 'react';

const WarehouseTransferDeleteAlert = React.lazy(
  () => import('@bigcapital/webapp/containers/Alerts/WarehousesTransfer/WarehouseTransferDeleteAlert'),
);
const WarehouseTransferInitiateAlert = React.lazy(
  () => import('@bigcapital/webapp/containers/Alerts/WarehousesTransfer/WarehouseTransferInitiateAlert'),
);
const TransferredWarehouseTransferAlert = React.lazy(
  () => import('@bigcapital/webapp/containers/Alerts/WarehousesTransfer/TransferredWarehouseTransferAlert'),
);

/**
 * Warehouses alerts.
 */
export default [
  {
    name: 'warehouse-transfer-delete',
    component: WarehouseTransferDeleteAlert,
  },
  {
    name: 'warehouse-transfer-initate',
    component: WarehouseTransferInitiateAlert,
  },
  {
    name: 'transferred-warehouse-transfer',
    component: TransferredWarehouseTransferAlert,
  },
];
