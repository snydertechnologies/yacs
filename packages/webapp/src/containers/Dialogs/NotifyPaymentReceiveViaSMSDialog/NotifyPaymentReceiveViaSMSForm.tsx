// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { AppToaster } from '@bigcapital/webapp/components';
import { Intent } from '@blueprintjs/core';

import NotifyViaSMSForm from '@bigcapital/webapp/containers/NotifyViaSMS/NotifyViaSMSForm';
import { transformErrors } from '@bigcapital/webapp/containers/NotifyViaSMS/utils';
import { useNotifyPaymentReceiveViaSMSContext } from './NotifyPaymentReceiveViaFormProvider';

import withDialogActions from '@bigcapital/webapp/containers/Dialog/withDialogActions';
import { compose } from '@bigcapital/webapp/utils';

const notificationType = {
  key: 'payment-receive-details',
  label: intl.get('sms_notification.payment_details.type'),
};

/**
 * Notify Payment Recive Via SMS Form.
 */
function NotifyPaymentReceiveViaSMSForm({
  // #withDialogActions
  closeDialog,
}) {
  const { dialogName, paymentReceiveId, paymentReceiveMSDetail, createNotifyPaymentReceivetBySMSMutate } =
    useNotifyPaymentReceiveViaSMSContext();

  const [calloutCode, setCalloutCode] = React.useState([]);

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('notify_payment_receive_via_sms.dialog.success_message'),
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
        transformErrors(errors, { setErrors, setCalloutCode });
      }
      setSubmitting(false);
    };
    createNotifyPaymentReceivetBySMSMutate([paymentReceiveId, values]).then(onSuccess).catch(onError);
  };
  // Handle the form cancel.
  const handleFormCancel = () => {
    closeDialog(dialogName);
  };

  // Form initial values.
  const initialValues = React.useMemo(
    () => ({
      ...paymentReceiveMSDetail,
      notification_key: notificationType.key,
    }),
    [paymentReceiveMSDetail],
  );

  return (
    <NotifyViaSMSForm
      initialValues={initialValues}
      notificationTypes={notificationType}
      onSubmit={handleFormSubmit}
      onCancel={handleFormCancel}
      calloutCodes={calloutCode}
    />
  );
}
export default compose(withDialogActions)(NotifyPaymentReceiveViaSMSForm);
