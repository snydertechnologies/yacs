import { FFormGroup, FormattedMessage as T, WarehouseSelect } from '@bigcapital/webapp/components';
import { compose, momentFormatter, tansformDateValue } from '@bigcapital/webapp/utils';
import { ControlGroup, FormGroup, InputGroup, Position } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import classNames from 'classnames';
import { ErrorMessage, FastField, Field } from 'formik';
// @ts-nocheck
import React from 'react';

import { FieldRequiredHint, Icon, InputPrependButton } from '@bigcapital/webapp/components';
import { CLASSES } from '@bigcapital/webapp/constants/classes';
import withDialogActions from '@bigcapital/webapp/containers/Dialog/withDialogActions';
import withSettings from '@bigcapital/webapp/containers/Settings/withSettings';
import { handleDateChange, inputIntent } from '@bigcapital/webapp/utils';
import { useWarehouseTransferFormContext } from './WarehouseTransferFormProvider';
import { useObserveTransferNoSettings } from './utils';

/**
 * Warehouse transfer form header fields.
 */
function WarehouseTransferFormHeaderFields({
  // #withDialogActions
  openDialog,

  // #withSettings
  warehouseTransferAutoIncrement,
  warehouseTransferNextNumber,
  warehouseTransferNumberPrefix,
}) {
  const { warehouses } = useWarehouseTransferFormContext();

  // Handle warehouse transfer number changing.
  const handleTransferNumberChange = () => {
    openDialog('warehouse-transfer-no-form');
  };

  // Handle transfer no. field blur.
  const handleTransferNoBlur = (form, field) => (event) => {
    const newValue = event.target.value;

    if (field.value !== newValue && warehouseTransferAutoIncrement) {
      openDialog('warehouse-transfer-no-form', {
        initialFormValues: {
          manualTransactionNo: newValue,
          incrementMode: 'manual-transaction',
        },
      });
    }
  };

  // Syncs transfer number settings with form.
  useObserveTransferNoSettings(warehouseTransferNumberPrefix, warehouseTransferNextNumber);

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ----------- Date ----------- */}
      <FastField name={'date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'date'} />}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--date', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('date', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM_LEFT, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ----------- Transfer number ----------- */}
      <Field name={'transaction_number'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'warehouse_transfer.label.transfer_no'} />}
            // labelInfo={<FieldRequiredHint />}
            inline={true}
            className={classNames('form-group--transfer-no', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="transfer_number" />}
          >
            <ControlGroup fill={true}>
              <InputGroup
                minimal={true}
                value={field.value}
                asyncControl={true}
                onBlur={handleTransferNoBlur(form, field)}
              />
              <InputPrependButton
                buttonProps={{
                  onClick: handleTransferNumberChange,
                  icon: <Icon icon={'settings-18'} />,
                }}
                tooltip={true}
                tooltipProps={{
                  content: <T id={'warehouse_transfer.setting_your_auto_generated_transfer_no'} />,
                  position: Position.BOTTOM_LEFT,
                }}
              />
            </ControlGroup>
          </FormGroup>
        )}
      </Field>

      {/* ----------- Form Warehouse ----------- */}
      <FFormGroup
        name={'from_warehouse_id'}
        items={warehouses}
        label={<T id={'warehouse_transfer.label.from_warehouse'} />}
        inline={true}
        labelInfo={<FieldRequiredHint />}
      >
        <WarehouseSelect
          name={'from_warehouse_id'}
          warehouses={warehouses}
          placeholder={<T id={'select_warehouse_transfer'} />}
          allowCreate={true}
          fill={true}
        />
      </FFormGroup>

      {/* ----------- To Warehouse ----------- */}
      <FFormGroup
        name={'to_warehouse_id'}
        label={<T id={'warehouse_transfer.label.to_warehouse'} />}
        inline={true}
        labelInfo={<FieldRequiredHint />}
      >
        <WarehouseSelect
          name={'to_warehouse_id'}
          warehouses={warehouses}
          placeholder={<T id={'select_warehouse_transfer'} />}
          fill={true}
          allowCreate={true}
        />
      </FFormGroup>
    </div>
  );
}

export default compose(
  withDialogActions,
  withSettings(({ warehouseTransferSettings }) => ({
    warehouseTransferAutoIncrement: warehouseTransferSettings?.autoIncrement,
    warehouseTransferNextNumber: warehouseTransferSettings?.nextNumber,
    warehouseTransferNumberPrefix: warehouseTransferSettings?.numberPrefix,
  })),
)(WarehouseTransferFormHeaderFields);
