import { Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import moment from 'moment';
import * as R from 'ramda';
// @ts-nocheck
import React, { useEffect, useLayoutEffect } from 'react';
import intl from 'react-intl-universal';

import { ExchangeRateInputGroup, Money, MoneyFieldCell } from '@bigcapital/webapp/components';

import withSettings from '@bigcapital/webapp/containers/Settings/withSettings';
import { useCurrentOrganization } from '@bigcapital/webapp/hooks/state';
import { transactionNumber } from '@bigcapital/webapp/utils';
import { useEstimateIsForeignCustomer } from './utils';

/**
 * Invoice date cell.
 */
function InvoiceDateCell({ value }) {
  return <span>{moment(value).format('YYYY MMM DD')}</span>;
}

/**
 * Invoice number table cell accessor.
 */
function InvNumberCellAccessor(row) {
  return row?.invoice_no ? `#${row?.invoice_no || ''}` : '-';
}

/**
 * Mobey table cell.
 */
function MoneyTableCell({ row: { original }, value }) {
  return <Money amount={value} currency={original.currency_code} />;
}

/**
 * Retrieve payment receive form entries columns.
 */
export const usePaymentReceiveEntriesColumns = () => {
  return React.useMemo(
    () => [
      {
        Header: 'Invoice date',
        id: 'invoice_date',
        accessor: 'invoice_date',
        Cell: InvoiceDateCell,
        disableSortBy: true,
        disableResizing: true,
        width: 250,
        className: 'date',
      },
      {
        Header: intl.get('invocie_number'),
        accessor: InvNumberCellAccessor,
        disableSortBy: true,
        className: 'invoice_number',
      },
      {
        Header: intl.get('invoice_amount'),
        accessor: 'amount',
        Cell: MoneyTableCell,
        disableSortBy: true,
        width: 100,
        className: 'invoice_amount',
      },
      {
        Header: intl.get('amount_due'),
        accessor: 'due_amount',
        Cell: MoneyTableCell,
        disableSortBy: true,
        width: 150,
        className: 'amount_due',
      },
      {
        Header: intl.get('payment_amount'),
        accessor: 'payment_amount',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        width: 150,
        className: 'payment_amount',
      },
    ],
    [],
  );
};

/**
 * payment receive exchange rate input field.
 * @returns {JSX.Element}
 */
export function PaymentReceiveExchangeRateInputField({ ...props }) {
  const currentOrganization = useCurrentOrganization();
  const { values } = useFormikContext();

  const isForeignCustomer = useEstimateIsForeignCustomer();

  // Can't continue if the customer is not foreign.
  if (!isForeignCustomer) {
    return null;
  }
  return (
    <ExchangeRateInputGroup
      fromCurrency={values.currency_code}
      toCurrency={currentOrganization.base_currency}
      {...props}
    />
  );
}

/**
 * payment receive project select.
 * @returns {JSX.Element}
 */
export function PaymentReceiveProjectSelectButton({ label }) {
  return <Button text={label ?? intl.get('select_project')} />;
}

/**
 * Syncs the auto-increment settings to payment receive form.
 * @returns {React.ReactNode}
 */
export const PaymentReceiveSyncIncrementSettingsToForm = R.compose(
  withSettings(({ paymentReceiveSettings }) => ({
    paymentReceiveNextNumber: paymentReceiveSettings?.nextNumber,
    paymentReceiveNumberPrefix: paymentReceiveSettings?.numberPrefix,
    paymentReceiveAutoIncrement: paymentReceiveSettings?.autoIncrement,
  })),
)(({ paymentReceiveNextNumber, paymentReceiveNumberPrefix, paymentReceiveAutoIncrement }) => {
  const { setFieldValue } = useFormikContext();

  useLayoutEffect(() => {
    if (!paymentReceiveAutoIncrement) return;

    setFieldValue('payment_receive_no', transactionNumber(paymentReceiveNumberPrefix, paymentReceiveNextNumber));
  }, [setFieldValue, paymentReceiveNumberPrefix, paymentReceiveNextNumber, paymentReceiveAutoIncrement]);
  return null;
});
