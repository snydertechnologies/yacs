import { Intent } from '@blueprintjs/core';
import { Formik } from 'formik';
// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import '@bigcapital/webapp/style/pages/ReconcileCreditNote/ReconcileCreditNoteForm.scss';
import { AppToaster } from '@bigcapital/webapp/components';
import withDialogActions from '@bigcapital/webapp/containers/Dialog/withDialogActions';
import { compose, transformToForm } from '@bigcapital/webapp/utils';
import { CreateReconcileCreditNoteFormSchema } from './ReconcileCreditNoteForm.schema';
import ReconcileCreditNoteFormContent from './ReconcileCreditNoteFormContent';
import { useReconcileCreditNoteContext } from './ReconcileCreditNoteFormProvider';
import { transformErrors } from './utils';

// Default form initial values.
const defaultInitialValues = {
  entries: [
    {
      invoice_id: '',
      amount: '',
    },
  ],
};

/**
 * Reconcile credit note form.
 */
function ReconcileCreditNoteForm({
  // #withDialogActions
  closeDialog,
}) {
  const { dialogName, creditNoteId, reconcileCreditNotes, createReconcileCreditNoteMutate } =
    useReconcileCreditNoteContext();

  // Initial form values.
  const initialValues = {
    entries: reconcileCreditNotes.map((entry) => ({
      ...entry,
      invoice_id: entry.id,
      amount: '',
    })),
  };

  // Handle form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);

    // Filters the entries.
    const entries = values.entries
      .filter((entry) => entry.invoice_id && entry.amount)
      .map((entry) => transformToForm(entry, defaultInitialValues.entries[0]));

    const form = {
      ...values,
      entries: entries,
    };
    // Handle the request success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('reconcile_credit_note.success_message'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      closeDialog(dialogName);
    };
    // Handle the request error.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      if (errors) {
        transformErrors(errors, { setErrors });
      }
      setSubmitting(false);
    };

    createReconcileCreditNoteMutate([creditNoteId, form]).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      validationSchema={CreateReconcileCreditNoteFormSchema}
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      component={ReconcileCreditNoteFormContent}
    />
  );
}

export default compose(withDialogActions)(ReconcileCreditNoteForm);
