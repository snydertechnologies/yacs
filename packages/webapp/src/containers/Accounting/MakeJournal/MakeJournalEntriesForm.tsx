import { Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import { Form, Formik } from 'formik';
import { isEmpty, omit } from 'lodash';
import * as R from 'ramda';
// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';

import { CLASSES } from '@bigcapital/webapp/constants/classes';
import { CreateJournalSchema, EditJournalSchema } from './MakeJournalEntries.schema';
import MakeJournalEntriesField from './MakeJournalEntriesField';
import MakeJournalEntriesHeader from './MakeJournalEntriesHeader';
import MakeJournalFormDialogs from './MakeJournalFormDialogs';
import MakeJournalFormFloatingActions from './MakeJournalFormFloatingActions';
import MakeJournalFormFooter from './MakeJournalFormFooter';
import MakeJournalFormTopBar from './MakeJournalFormTopBar';
import { useMakeJournalFormContext } from './MakeJournalProvider';

import withCurrentOrganization from '@bigcapital/webapp/containers/Organization/withCurrentOrganization';
import withSettings from '@bigcapital/webapp/containers/Settings/withSettings';

import { AppToaster } from '@bigcapital/webapp/components';
import { compose, orderingLinesIndexes, transactionNumber } from '@bigcapital/webapp/utils';
import { JournalSyncIncrementSettingsToForm } from './components';
import { defaultManualJournal, transformErrors, transformToEditForm } from './utils';

/**
 * Journal entries form.
 */
function MakeJournalEntriesForm({
  // #withSettings
  journalNextNumber,
  journalNumberPrefix,
  journalAutoIncrement,

  // #withCurrentOrganization
  organization: { base_currency },
}) {
  // Journal form context.
  const { createJournalMutate, editJournalMutate, isNewMode, manualJournal, submitPayload } =
    useMakeJournalFormContext();

  const history = useHistory();

  // New journal number.
  const journalNumber = transactionNumber(journalNumberPrefix, journalNextNumber);

  // Form initial values.
  const initialValues = useMemo(
    () => ({
      ...(!isEmpty(manualJournal)
        ? {
            ...transformToEditForm(manualJournal),
          }
        : {
            ...defaultManualJournal,
            // If the auto-increment mode is enabled, take the next journal
            // number from the settings.
            ...(journalAutoIncrement && {
              journal_number: journalNumber,
            }),
            currency_code: base_currency,
          }),
    }),
    [manualJournal, base_currency, journalNumber, journalAutoIncrement],
  );

  // Handle the form submiting.
  const handleSubmit = (values, { setErrors, setSubmitting, resetForm }) => {
    setSubmitting(true);
    const entries = values.entries.filter((entry) => entry.debit || entry.credit);
    const getTotal = (type = 'credit') => {
      return entries.reduce((total, item) => {
        return item[type] ? item[type] + total : total;
      }, 0);
    };
    const totalCredit = getTotal('credit');
    const totalDebit = getTotal('debit');

    // Validate the total credit should be eqials total debit.
    if (totalCredit !== totalDebit) {
      AppToaster.show({
        message: intl.get('should_total_of_credit_and_debit_be_equal'),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    } else if (totalCredit === 0 || totalDebit === 0) {
      AppToaster.show({
        message: intl.get('amount_cannot_be_zero_or_empty'),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    const form = {
      ...omit(values, ['journal_number_manually']),
      ...(values.journal_number_manually && {
        journal_number: values.journal_number,
      }),
      entries: R.compose(orderingLinesIndexes)(entries),
      publish: submitPayload.publish,
    };
    // Handle the request error.
    const handleError = ({
      response: {
        data: { errors },
      },
    }) => {
      transformErrors(errors, { setErrors });
      setSubmitting(false);
    };
    // Handle the request success.
    const handleSuccess = (errors) => {
      AppToaster.show({
        message: intl.get(
          isNewMode ? 'the_journal_has_been_created_successfully' : 'the_journal_has_been_edited_successfully',
          { number: values.journal_number },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (submitPayload.redirect) {
        history.push('/manual-journals');
      }
      if (submitPayload.resetForm) {
        resetForm();
      }
    };
    if (isNewMode) {
      createJournalMutate(form).then(handleSuccess).catch(handleError);
    } else {
      editJournalMutate([manualJournal.id, form]).then(handleSuccess).catch(handleError);
    }
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM, CLASSES.PAGE_FORM_STRIP_STYLE, CLASSES.PAGE_FORM_MAKE_JOURNAL)}>
      <Formik
        initialValues={initialValues}
        validationSchema={isNewMode ? CreateJournalSchema : EditJournalSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <MakeJournalFormTopBar />
          <MakeJournalEntriesHeader />
          <MakeJournalEntriesField />
          <MakeJournalFormFooter />
          <MakeJournalFormFloatingActions />

          {/* --------- Dialogs --------- */}
          <MakeJournalFormDialogs />

          {/* --------- Effects --------- */}
          <JournalSyncIncrementSettingsToForm />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(
  withSettings(({ manualJournalsSettings }) => ({
    journalNextNumber: manualJournalsSettings?.nextNumber,
    journalNumberPrefix: manualJournalsSettings?.numberPrefix,
    journalAutoIncrement: manualJournalsSettings?.autoIncrement,
  })),
  withCurrentOrganization(),
)(MakeJournalEntriesForm);
