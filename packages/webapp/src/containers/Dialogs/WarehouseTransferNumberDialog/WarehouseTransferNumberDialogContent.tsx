// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import ReferenceNumberForm from '@bigcapital/webapp/containers/JournalNumber/ReferenceNumberForm';
import { useSaveSettings } from '@bigcapital/webapp/hooks/query';
import { WarehouseTransferNumberDialogProvider } from './WarehouseTransferNumberDialogProvider';

import withDialogActions from '@bigcapital/webapp/containers/Dialog/withDialogActions';
import { transformFormToSettings, transformSettingsToForm } from '@bigcapital/webapp/containers/JournalNumber/utils';
import withSettings from '@bigcapital/webapp/containers/Settings/withSettings';
import withSettingsActions from '@bigcapital/webapp/containers/Settings/withSettingsActions';
import { compose } from '@bigcapital/webapp/utils';

/**
 * Warehouse transfer no dialog content.
 */
function WarehouseTransferNumberDialogContent({
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
      closeDialog('warehouse-transfer-no-form');
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
    const options = transformFormToSettings(values, 'warehouse_transfers');

    // Save the settings.
    saveSettings({ options }).then(handleSuccess).catch(handleErrors);
  };

  // Handle the dialog close.
  const handleClose = () => {
    closeDialog('warehouse-transfer-no-form');
  };

  // Handle form change.
  const handleChange = (values) => {
    setReferenceFormValues(values);
  };
  // Description.
  const description =
    referenceFormValues?.incrementMode === 'auto'
      ? intl.get('warehouse_transfer.auto_increment.auto')
      : intl.get('warehouse_transfer.auto_increment.manually');

  return (
    <WarehouseTransferNumberDialogProvider>
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
    </WarehouseTransferNumberDialogProvider>
  );
}
export default compose(
  withDialogActions,
  withSettingsActions,
  withSettings(({ warehouseTransferSettings }) => ({
    autoIncrement: warehouseTransferSettings?.autoIncrement,
    nextNumber: warehouseTransferSettings?.nextNumber,
    numberPrefix: warehouseTransferSettings?.numberPrefix,
  })),
)(WarehouseTransferNumberDialogContent);
