import { FormattedMessage as T } from '@bigcapital/webapp/components';
import { Button, Classes, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
// @ts-nocheck
import React from 'react';

import withDialogActions from '@bigcapital/webapp/containers/Dialog/withDialogActions';
import { compose } from '@bigcapital/webapp/utils';
import { useBadDebtContext } from './BadDebtFormProvider';

/**
 * Bad bebt form floating actions.
 */
function BadDebtFormFloatingActions({
  // #withDialogActions
  closeDialog,
}) {
  // bad debt invoice dialog context.
  const { dialogName } = useBadDebtContext();

  // Formik context.
  const { isSubmitting } = useFormikContext();

  // Handle close button click.
  const handleCancelBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button onClick={handleCancelBtnClick} style={{ minWidth: '75px' }}>
          <T id={'cancel'} />
        </Button>
        <Button intent={Intent.PRIMARY} loading={isSubmitting} style={{ minWidth: '75px' }} type="submit">
          {<T id={'save'} />}
        </Button>
      </div>
    </div>
  );
}

export default compose(withDialogActions)(BadDebtFormFloatingActions);
