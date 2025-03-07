import { DialogContent } from '@bigcapital/webapp/components';
import { useCreateWarehouse, useEditWarehouse, useWarehouse } from '@bigcapital/webapp/hooks/query';
// @ts-nocheck
import React from 'react';

const WarehouseFormContext = React.createContext();

/**
 * Warehouse form provider.
 */
function WarehouseFormProvider({ dialogName, warehouseId, ...props }) {
  // Create and edit warehouse mutations.
  const { mutateAsync: createWarehouseMutate } = useCreateWarehouse();
  const { mutateAsync: editWarehouseMutate } = useEditWarehouse();

  // Handle fetch invoice detail.
  const { data: warehouse, isLoading: isWarehouseLoading } = useWarehouse(warehouseId, {
    enabled: !!warehouseId,
  });

  // State provider.
  const provider = {
    dialogName,
    warehouse,
    warehouseId,
    createWarehouseMutate,
    editWarehouseMutate,
  };

  return (
    <DialogContent isLoading={isWarehouseLoading}>
      <WarehouseFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useWarehouseFormContext = () => React.useContext(WarehouseFormContext);

export { WarehouseFormProvider, useWarehouseFormContext };
