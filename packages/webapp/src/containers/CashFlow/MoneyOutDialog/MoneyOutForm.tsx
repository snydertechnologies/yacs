import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
import { omit } from 'lodash';
import moment from 'moment';
// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import '@bigcapital/webapp/style/pages/CashFlow/CashflowTransactionForm.scss';

import { AppToaster } from '@bigcapital/webapp/components';

import { CreateMoneyOutSchema } from './MoneyOutForm.schema';
import MoneyOutFormContent from './MoneyOutFormContent';

import { useMoneyOutDialogContext } from './MoneyOutDialogProvider';

import withDialogActions from '@bigcapital/webapp/containers/Dialog/withDialogActions';
import withCurrentOrganization from '@bigcapital/webapp/containers/Organization/withCurrentOrganization';
import withSettings from '@bigcapital/webapp/containers/Settings/withSettings';

import { compose, transactionNumber } from '@bigcapital/webapp/utils';

const defaultInitialValues = {
  date: moment(new Date()).format('YYYY-MM-DD'),
  amount: '',
  transaction_number: '',
  transaction_type: '',
  reference_no: '',
  cashflow_account_id: '',
  credit_account_id: '',
  description: '',
  publish: '',
  exchange_rate: 1,
};

function MoneyOutForm({
  // #withDialogActions
  closeDialog,

  // #withCurrentOrganization
  organization: { base_currency },

  // #withSettings
  transactionNextNumber,
  transactionNumberPrefix,
  transactionIncrementMode,
}) {
  const { dialogName, accountId, accountType, createCashflowTransactionMutate } = useMoneyOutDialogContext();

  // transaction number.
  const transactionNo = transactionNumber(transactionNumberPrefix, transactionNextNumber);

  // Initial form values.
  const initialValues = {
    ...defaultInitialValues,
    currency_code: base_currency,
    transaction_type: accountType,
    ...(transactionIncrementMode && {
      transaction_number: transactionNo,
    }),
    cashflow_account_id: accountId,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    const form = {
      ...omit(values, ['currency_code']),
      publish: true,
    };
    setSubmitting(true);
    createCashflowTransactionMutate(form)
      .then(() => {
        closeDialog(dialogName);

        AppToaster.show({
          message: intl.get('cash_flow_transaction_success_message'),
          intent: Intent.SUCCESS,
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };
  return (
    <Formik validationSchema={CreateMoneyOutSchema} initialValues={initialValues} onSubmit={handleFormSubmit}>
      <MoneyOutFormContent />
    </Formik>
  );
}

export default compose(
  withDialogActions,
  withCurrentOrganization(),
  withSettings(({ cashflowSetting }) => ({
    transactionNextNumber: cashflowSetting?.nextNumber,
    transactionNumberPrefix: cashflowSetting?.numberPrefix,
    transactionIncrementMode: cashflowSetting?.autoIncrement,
  })),
)(MoneyOutForm);
