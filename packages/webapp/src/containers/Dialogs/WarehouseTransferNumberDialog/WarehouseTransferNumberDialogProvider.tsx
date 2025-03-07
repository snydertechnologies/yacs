import { DialogContent } from '@bigcapital/webapp/components';
import { useSettingsWarehouseTransfers } from '@bigcapital/webapp/hooks/query';
// @ts-nocheck
import React, { createContext } from 'react';

const WarehouseTransferNumberDilaogContext = createContext();

/**
 * Warehouse transfer number dialog provier.
 */
function WarehouseTransferNumberDialogProvider({ query, ...props }) {
  const { isLoading: isSettingsLoading } = useSettingsWarehouseTransfers();

  // Provider payload.
  const provider = {
    isSettingsLoading,
  };

  return (
    <DialogContent isLoading={isSettingsLoading}>
      <WarehouseTransferNumberDilaogContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useWarehouseTransferNumberDialogContext = () => React.useContext(WarehouseTransferNumberDilaogContext);

export { WarehouseTransferNumberDialogProvider, useWarehouseTransferNumberDialogContext };
