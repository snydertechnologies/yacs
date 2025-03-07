import classNames from 'classnames';
// @ts-nocheck
import React, { lazy } from 'react';

import { Dialog, DialogSuspense } from '@bigcapital/webapp/components';
import withDialogRedux from '@bigcapital/webapp/components/DialogReduxConnect';
import { CLASSES } from '@bigcapital/webapp/constants/classes';
import { compose } from '@bigcapital/webapp/utils';

// Lazy loading the content.
const InventoryItemDetailsPdfDialogContent = lazy(() => import('./InventoryItemDetailsPdfDialogContent'));

/**
 * Inventory item details sheet pdf preview dialog.
 * @returns {React.ReactNode}
 */
function InventoryItemDetailsPdfDialogRoot({ dialogName, payload, isOpen }) {
  return (
    <Dialog
      name={dialogName}
      title={'Inventory Item Details Print Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <InventoryItemDetailsPdfDialogContent dialogName={dialogName} />
      </DialogSuspense>
    </Dialog>
  );
}

export const InventoryItemDetailsPdfDialog = compose(withDialogRedux())(InventoryItemDetailsPdfDialogRoot);
