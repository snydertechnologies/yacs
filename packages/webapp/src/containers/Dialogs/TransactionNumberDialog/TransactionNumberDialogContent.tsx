import { useSaveSettings } from '@bigcapital/webapp/hooks/query';
// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import ReferenceNumberForm from '@bigcapital/webapp/containers/JournalNumber/ReferenceNumberForm';
import { TransactionNumberDialogProvider } from './TransactionNumberDialogProvider';

import withDialogActions from '@bigcapital/webapp/containers/Dialog/withDialogActions';
import { transformFormToSettings, transformSettingsToForm } from '@bigcapital/webapp/containers/JournalNumber/utils';
import withSettings from '@bigcapital/webapp/containers/Settings/withSettings';
import withSettingsActions from '@bigcapital/webapp/containers/Settings/withSettingsActions';
import { compose } from '@bigcapital/webapp/utils';

/**
 * Transaction number dialog content.
 */
function TransactionNumberDialogContent({
  // #ownProps
  initialValues,
  onConfirm,

  // #withSettings
  nextNumber,
  numberPrefix,
  autoIncrement,

  // #withDialogActions
  closeDialog,
}) {
  const { mutateAsync: saveSettings } = useSaveSettings();
  const [referenceFormValues, setReferenceFormValues] = React.useState(null);

  // Handle the submit form.
  const handleSubmitForm = (values, { setSubmitting }) => {
    // Handle the form success.
    const handleSuccess = () => {
      setSubmitting(false);
      closeDialog('transaction-number-form');
      onConfirm(values);
    };
    // Handle the form errors.
    const handleErrors = () => {
      setSubmitting(false);
    };
    if (values.incrementMode === 'manual-transaction') {
      handleSuccess();
      return;
    }
    // Transformes the form values to settings to save it.
    const options = transformFormToSettings(values, 'cashflow');

    // Save the settings.
    saveSettings({ options }).then(handleSuccess).catch(handleErrors);
  };

  // Description.
  const description =
    referenceFormValues?.incrementMode === 'auto'
      ? intl.get('cash_flow.auto_increment.auto')
      : intl.get('cash_flow.auto_increment.manually');

  // Handle the dialog close.
  const handleClose = () => {
    closeDialog('transaction-number-form');
  };

  // Handle form change.
  const handleChange = (values) => {
    setReferenceFormValues(values);
  };

  return (
    <TransactionNumberDialogProvider>
      <ReferenceNumberForm
        initialValues={{
          ...transformSettingsToForm({
            nextNumber,
            numberPrefix,
            autoIncrement,
          }),
          ...initialValues,
        }}
        description={description}
        onSubmit={handleSubmitForm}
        onClose={handleClose}
        onChange={handleChange}
      />
    </TransactionNumberDialogProvider>
  );
}

export default compose(
  withDialogActions,
  withSettingsActions,
  withSettings(({ cashflowSetting }) => ({
    nextNumber: cashflowSetting?.nextNumber,
    numberPrefix: cashflowSetting?.numberPrefix,
    autoIncrement: cashflowSetting?.autoIncrement,
  })),
)(TransactionNumberDialogContent);
