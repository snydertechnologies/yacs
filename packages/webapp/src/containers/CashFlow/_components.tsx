import { ControlGroup, InputGroup, Position } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import * as R from 'ramda';
// @ts-nocheck
import React from 'react';

import { FFormGroup, Icon, InputPrependButton, FormattedMessage as T } from '@bigcapital/webapp/components';
import { useUpdateEffect } from '@bigcapital/webapp/hooks';

import withDialogActions from '@bigcapital/webapp/containers/Dialog/withDialogActions';
import withSettings from '@bigcapital/webapp/containers/Settings/withSettings';
import { transactionNumber } from '@bigcapital/webapp/utils';

/**
 * Syncs cashflow auto-increment settings to the form once update.
 */
export const MoneyInOutSyncIncrementSettingsToForm = R.compose(
  withDialogActions,
  withSettings(({ cashflowSetting }) => ({
    transactionAutoIncrement: cashflowSetting?.autoIncrement,
    transactionNextNumber: cashflowSetting?.nextNumber,
    transactionNumberPrefix: cashflowSetting?.numberPrefix,
  })),
)(
  ({
    // #withSettings
    transactionAutoIncrement,
    transactionNextNumber,
    transactionNumberPrefix,
  }) => {
    const { setFieldValue } = useFormikContext();

    useUpdateEffect(() => {
      // Do not update if the invoice auto-increment is disabled.
      if (!transactionAutoIncrement) return null;

      const newTransactionNumber = transactionNumber(transactionNumberPrefix, transactionNextNumber);
      setFieldValue('transaction_number', newTransactionNumber);
    }, [setFieldValue, transactionNumberPrefix, transactionNextNumber]);

    return null;
  },
);

/**
 * Money In/Out transaction number field.
 */
export const MoneyInOutTransactionNoField = R.compose(
  withDialogActions,
  withSettings(({ cashflowSetting }) => ({
    transactionAutoIncrement: cashflowSetting?.autoIncrement,
    transactionNextNumber: cashflowSetting?.nextNumber,
    transactionNumberPrefix: cashflowSetting?.numberPrefix,
  })),
)(
  ({
    // #withDialogActions
    openDialog,

    // #withSettings
    transactionAutoIncrement,
  }) => {
    const { values, setFieldValue } = useFormikContext();

    // Handle tranaction number changing.
    const handleTransactionNumberChange = () => {
      openDialog('transaction-number-form');
    };
    // Handle transaction no. field blur.
    const handleTransactionNoBlur = (event) => {
      const newValue = event.target.value;

      if (values.transaction_number !== newValue && transactionAutoIncrement) {
        openDialog('transaction-number-form', {
          initialFormValues: {
            onceManualNumber: newValue,
            incrementMode: 'manual-transaction',
          },
        });
      }
      if (!transactionAutoIncrement) {
        setFieldValue('transaction_number', values.transaction_number);
        setFieldValue('transaction_number_manually', values.transaction_number);
      }
    };

    return (
      <FFormGroup name={'transaction_number'} label={<T id={'transaction_number'} />}>
        <ControlGroup fill={true}>
          <InputGroup
            minimal={true}
            value={values.transaction_number}
            asyncControl={true}
            onBlur={handleTransactionNoBlur}
          />
          <InputPrependButton
            buttonProps={{
              onClick: handleTransactionNumberChange,
              icon: <Icon icon={'settings-18'} />,
            }}
            tooltip={true}
            tooltipProps={{
              content: <T id={'cash_flow.setting_your_auto_generated_transaction_number'} />,
              position: Position.BOTTOM_LEFT,
            }}
          />
        </ControlGroup>
      </FFormGroup>
    );
  },
);
