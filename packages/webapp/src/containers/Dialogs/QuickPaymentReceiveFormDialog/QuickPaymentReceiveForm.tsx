import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
import { defaultTo, omit, pick } from 'lodash';
// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { AppToaster } from '@bigcapital/webapp/components';
import { CreateQuickPaymentReceiveFormSchema } from './QuickPaymentReceive.schema';
import QuickPaymentReceiveFormContent from './QuickPaymentReceiveFormContent';
import { useQuickPaymentReceiveContext } from './QuickPaymentReceiveFormProvider';

import withDialogActions from '@bigcapital/webapp/containers/Dialog/withDialogActions';
import withSettings from '@bigcapital/webapp/containers/Settings/withSettings';
import { compose, transactionNumber } from '@bigcapital/webapp/utils';
import { defaultInitialValues, transformErrors } from './utils';

/**
 * Quick payment receive form.
 */
function QuickPaymentReceiveForm({
  // #withDialogActions
  closeDialog,

  // #withSettings
  paymentReceiveAutoIncrement,
  paymentReceiveNumberPrefix,
  paymentReceiveNextNumber,
  preferredDepositAccount,
}) {
  const { dialogName, invoice, createPaymentReceiveMutate } = useQuickPaymentReceiveContext();

  // Payment receive number.
  const nextPaymentNumber = transactionNumber(paymentReceiveNumberPrefix, paymentReceiveNextNumber);

  // Initial form values
  const initialValues = {
    ...defaultInitialValues,
    ...(paymentReceiveAutoIncrement && {
      payment_receive_no: nextPaymentNumber,
    }),
    deposit_account_id: defaultTo(preferredDepositAccount, ''),
    ...invoice,
  };

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setFieldError }) => {
    const entries = [values]
      .filter((entry) => entry.id && entry.payment_amount)
      .map((entry) => ({
        invoice_id: entry.id,
        ...pick(entry, ['payment_amount']),
      }));

    const form = {
      ...omit(values, ['payment_receive_no']),
      ...(!paymentReceiveAutoIncrement && {
        payment_receive_no: values.payment_receive_no,
      }),
      customer_id: values.customer.id,
      entries,
    };

    // Handle request response success.
    const onSaved = (response) => {
      AppToaster.show({
        message: intl.get('the_payment_receive_transaction_has_been_created'),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    };
    // Handle request response errors.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      if (errors) {
        transformErrors(errors, { setFieldError });
      }
      setSubmitting(false);
    };
    createPaymentReceiveMutate(form).then(onSaved).catch(onError);
  };

  return (
    <Formik
      validationSchema={CreateQuickPaymentReceiveFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={QuickPaymentReceiveFormContent}
    />
  );
}

export default compose(
  withDialogActions,
  withSettings(({ paymentReceiveSettings }) => ({
    paymentReceiveNextNumber: paymentReceiveSettings?.nextNumber,
    paymentReceiveNumberPrefix: paymentReceiveSettings?.numberPrefix,
    paymentReceiveAutoIncrement: paymentReceiveSettings?.autoIncrement,
    preferredDepositAccount: paymentReceiveSettings?.preferredDepositAccount,
  })),
)(QuickPaymentReceiveForm);
