import { FFormGroup, FSwitch } from '@bigcapital/webapp/components';
import { MailNotificationForm } from '@bigcapital/webapp/containers/SendMailNotification';
import { saveInvoke } from '@bigcapital/webapp/utils';
import { Button, Classes, Intent } from '@blueprintjs/core';
// @ts-nocheck
import { Form, useFormikContext } from 'formik';
import styled from 'styled-components';
import { useReceiptMailDialogBoot } from './ReceiptMailDialogBoot';

interface SendMailNotificationFormProps {
  onClose?: () => void;
}

export function ReceiptMailDialogFormContent({ onClose }: SendMailNotificationFormProps) {
  const { mailOptions } = useReceiptMailDialogBoot();
  const { isSubmitting } = useFormikContext();

  const handleClose = () => {
    saveInvoke(onClose);
  };

  return (
    <Form>
      <div className={Classes.DIALOG_BODY}>
        <MailNotificationForm fromAddresses={mailOptions.from_addresses} toAddresses={mailOptions.to_addresses} />
        <AttachFormGroup name={'attachReceipt:'} inline>
          <FSwitch name={'attachReceipt:'} label={'Attach Receipt'} />
        </AttachFormGroup>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button disabled={isSubmitting} onClick={handleClose} style={{ minWidth: '65px' }}>
            Close
          </Button>

          <Button intent={Intent.PRIMARY} loading={isSubmitting} style={{ minWidth: '75px' }} type="submit">
            Send
          </Button>
        </div>
      </div>
    </Form>
  );
}

const AttachFormGroup = styled(FFormGroup)`
  background: #f8f9fb;
  margin-top: 0.6rem;
  padding: 4px 14px;
  border-radius: 5px;
  border: 1px solid #dcdcdd;
`;
