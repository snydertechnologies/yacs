import { ExchangeRateInputGroup } from '@bigcapital/webapp/components';
import { DialogsName } from '@bigcapital/webapp/constants/dialogs';
import withDialogActions from '@bigcapital/webapp/containers/Dialog/withDialogActions';
import {
  useSyncExRateToForm,
  withExchangeRateFetchingLoading,
  withExchangeRateItemEntriesPriceRecalc,
} from '@bigcapital/webapp/containers/Entries/withExRateItemEntriesPriceRecalc';
import withSettings from '@bigcapital/webapp/containers/Settings/withSettings';
import { useUpdateEffect } from '@bigcapital/webapp/hooks';
import { useCurrentOrganization } from '@bigcapital/webapp/hooks/state';
import { transactionNumber } from '@bigcapital/webapp/utils';
import { Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import * as R from 'ramda';
// @ts-nocheck
import React, { useRef } from 'react';
import intl from 'react-intl-universal';
import { useEstimateIsForeignCustomer, useEstimateTotals } from './utils';

/**
 * Estimate exchange rate input field.
 * @returns {JSX.Element}
 */
function EstimateExchangeRateInputFieldRoot({ ...props }) {
  const currentOrganization = useCurrentOrganization();
  const { values } = useFormikContext();
  const isForeignCustomer = useEstimateIsForeignCustomer();

  // Can't continue if the customer is not foreign.
  if (!isForeignCustomer) {
    return null;
  }
  return (
    <ExchangeRateInputGroup
      name={'exchange_rate'}
      fromCurrency={values.currency_code}
      toCurrency={currentOrganization.base_currency}
      formGroupProps={{ label: ' ', inline: true }}
      withPopoverRecalcConfirm
      {...props}
    />
  );
}

/**
 * Renders the estimate exchange rate input field with exchange rate
 * with item entries price re-calc once exchange rate change.
 * @returns {JSX.Element}
 */
export const EstimateExchangeRateInputField = R.compose(
  withExchangeRateFetchingLoading,
  withExchangeRateItemEntriesPriceRecalc,
)(EstimateExchangeRateInputFieldRoot);

/**
 * Estimate project select.
 * @returns {JSX.Element}
 */
export function EstimateProjectSelectButton({ label }) {
  return <Button text={label ?? intl.get('select_project')} />;
}

/**
 * Syncs the estimate auto-increment settings to estimate form.
 * @returns {React.ReactNode}
 */
export const EstimateIncrementSyncSettingsToForm = R.compose(
  withSettings(({ estimatesSettings }) => ({
    estimateNextNumber: estimatesSettings?.nextNumber,
    estimateNumberPrefix: estimatesSettings?.numberPrefix,
    estimateAutoIncrement: estimatesSettings?.autoIncrement,
  })),
)(({ estimateNextNumber, estimateNumberPrefix, estimateAutoIncrement }) => {
  const { setFieldValue } = useFormikContext();

  useUpdateEffect(() => {
    // Do not update if the estimate auto-increment mode is disabled.
    if (!estimateAutoIncrement) return null;

    setFieldValue('estimate_number', transactionNumber(estimateNumberPrefix, estimateNextNumber));
  }, [setFieldValue, estimateNumberPrefix, estimateNextNumber, estimateAutoIncrement]);

  return null;
});

/**
 * Syncs the auto exchange rate to the estimate form and shows up popup to user
 * as an indication the entries rates have been changed.
 * @returns {React.ReactNode}
 */
export const EstimateSyncAutoExRateToForm = R.compose(withDialogActions)(
  ({
    // #withDialogActions
    openDialog,
  }) => {
    const { total } = useEstimateTotals();
    const timeout = useRef();

    useSyncExRateToForm({
      onSynced: () => {
        // If the total bigger then zero show alert to the user after adjusting entries.
        if (total > 0) {
          clearTimeout(timeout.current);
          timeout.current = setTimeout(() => {
            openDialog(DialogsName.InvoiceExchangeRateChangeNotice);
          }, 500);
        }
      },
    });

    return null;
  },
);
