import { FormattedMessage as T } from '@bigcapital/webapp/components';
import { Button, Classes, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
// @ts-nocheck
import React from 'react';

import { useMoneyOutDialogContext } from './MoneyOutDialogProvider';

import withDialogActions from '@bigcapital/webapp/containers/Dialog/withDialogActions';

import { compose } from '@bigcapital/webapp/utils';

/**
 * Money out floating actions.
 */
function MoneyOutFloatingActions({
  // #withDialogActions
  closeDialog,
}) {
  // Formik context.
  const { isSubmitting, submitForm } = useFormikContext();
  //  money in  dialog context.
  const { dialogName, setSubmitPayload, submitPayload } = useMoneyOutDialogContext();

  // handle submit as draft button click.
  const handleSubmitDraftBtnClick = () => {
    setSubmitPayload({ publish: false });
    submitForm();
  };
  // Handle submit  button click.
  const handleSubmittBtnClick = () => {
    setSubmitPayload({ publish: true });
  };
  // Handle close button click.
  const handleCloseBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button disabled={isSubmitting} onClick={handleCloseBtnClick} style={{ minWidth: '75px' }}>
          <T id={'close'} />
        </Button>

        <Button
          intent={Intent.PRIMARY}
          disabled={isSubmitting}
          loading={isSubmitting && submitPayload.publish}
          style={{ minWidth: '75px' }}
          type="submit"
          onClick={handleSubmittBtnClick}
        >
          {<T id={'save_and_publish'} />}
        </Button>
      </div>
    </div>
  );
}

export default compose(withDialogActions)(MoneyOutFloatingActions);
