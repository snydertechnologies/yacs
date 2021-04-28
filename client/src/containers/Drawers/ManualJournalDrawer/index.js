import React, { lazy } from 'react';
import { Drawer, DrawerSuspense } from 'components';
import withDrawers from 'containers/Drawer/withDrawers';

import { compose } from 'utils';

const ManualJournalDrawerContent = lazy(() =>
  import('./ManualJournalDrawerContent'),
);

/**
 * Manual journal drawer.
 */
function ManualJournalDrawer({
  name,

  //#withDrawer
  isOpen,
  payload: { manualJournalId },
}) {
  return (
    <Drawer isOpen={isOpen} name={name}>
      <DrawerSuspense>
        <ManualJournalDrawerContent manualJournalId={manualJournalId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export default compose(withDrawers())(ManualJournalDrawer);
