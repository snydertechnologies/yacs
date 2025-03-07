import VendorCreditNumberDialog from '@bigcapital/webapp/containers/Dialogs/VendorCreditNumberDialog';
import { useFormikContext } from 'formik';
// @ts-nocheck
import React from 'react';

/**
 * Vendor credit form dialog.
 */
export default function VendorCreditNoteFormDialogs() {
  // Update the form once the vendor credit number form submit confirm.
  const handleVendorCreditNumberFormConfirm = ({ incrementNumber, manually }) => {
    setFieldValue('vendor_credit_number', incrementNumber || '');
    setFieldValue('vendor_credit_no_manually', manually);
  };
  const { setFieldValue } = useFormikContext();

  return (
    <React.Fragment>
      <VendorCreditNumberDialog dialogName={'vendor-credit-form'} onConfirm={handleVendorCreditNumberFormConfirm} />
    </React.Fragment>
  );
}
