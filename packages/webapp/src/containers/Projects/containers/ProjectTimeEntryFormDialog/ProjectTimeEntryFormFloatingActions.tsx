import { FormattedMessage as T } from '@bigcapital/webapp/components';
import withDialogActions from '@bigcapital/webapp/containers/Dialog/withDialogActions';
import { compose } from '@bigcapital/webapp/utils';
import { Button, Classes, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
// @ts-nocheck
import React from 'react';
import { useProjectTimeEntryFormContext } from './ProjectTimeEntryFormProvider';

/**
 * Projcet time entry form floating actions.
 * @returns
 */
function ProjectTimeEntryFormFloatingActions({
  // #withDialogActions
  closeDialog,
}) {
  // time entry form dialog context.
  const { dialogName } = useProjectTimeEntryFormContext();

  // Formik context.
  const { isSubmitting } = useFormikContext();

  // Handle close button click.
  const handleCancelBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button intent={Intent.PRIMARY} loading={isSubmitting} style={{ minWidth: '95px' }} type="submit">
          <T id={'project_time_entry.dialog.create'} />
        </Button>
      </div>
    </div>
  );
}

export default compose(withDialogActions)(ProjectTimeEntryFormFloatingActions);
