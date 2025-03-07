import { Dialog, DialogSuspense, FormattedMessage as T } from '@bigcapital/webapp/components';
import withDialogRedux from '@bigcapital/webapp/components/DialogReduxConnect';
// @ts-nocheck
import React from 'react';

import { compose } from '@bigcapital/webapp/utils';

const WarehouseFormDialogContent = React.lazy(() => import('./WarehouseFormDialogContent'));

/**
 * Warehouse form form dialog.
 */
function WarehouseFormDialog({ dialogName, payload: { warehouseId = null, action }, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={
        action == 'edit' ? (
          <T id={'warehouse.dialog.label.edit_warehouse'} />
        ) : (
          <T id={'warehouse.dialog.label.new_warehouse'} />
        )
      }
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--warehouse-form'}
    >
      <DialogSuspense>
        <WarehouseFormDialogContent dialogName={dialogName} warehouseId={warehouseId} />
      </DialogSuspense>
    </Dialog>
  );
}
export default compose(withDialogRedux())(WarehouseFormDialog);
