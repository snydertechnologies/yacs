import { AppToaster, FormattedHTMLMessage, FormattedMessage as T } from '@bigcapital/webapp/components';
import { Alert, Intent } from '@blueprintjs/core';
// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import withAlertActions from '@bigcapital/webapp/containers/Alert/withAlertActions';
import withAlertStoreConnect from '@bigcapital/webapp/containers/Alert/withAlertStoreConnect';
import withDrawerActions from '@bigcapital/webapp/containers/Drawer/withDrawerActions';

import { useDeleteReconcileCredit } from '@bigcapital/webapp/hooks/query';
import { compose } from '@bigcapital/webapp/utils';

/**
 * Reconcile credit note delete alert.
 */
function ReconcileCreditNoteDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { creditNoteId },

  // #withAlertActions
  closeAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const { isLoading, mutateAsync: deleteReconcileCreditMutate } = useDeleteReconcileCredit();

  // handle cancel delete credit note alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  const handleConfirmVendorCreditDelete = () => {
    deleteReconcileCreditMutate(creditNoteId)
      .then(() => {
        AppToaster.show({
          message: intl.get('reconcile_credit_note.alert.success_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          // handleDeleteErrors(errors);
        },
      )
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmVendorCreditDelete}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage id={'reconcile_credit_note.once_you_delete_this_reconcile_credit_note'} />
      </p>
    </Alert>
  );
}

export default compose(withAlertStoreConnect(), withAlertActions, withDrawerActions)(ReconcileCreditNoteDeleteAlert);
