import { DrawerHeaderContent, DrawerLoading } from '@bigcapital/webapp/components';
import { DRAWERS } from '@bigcapital/webapp/constants/drawers';
import { useRefundVendorCreditTransaction } from '@bigcapital/webapp/hooks/query';
// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

const RefundVendorCreditDrawerContent = React.createContext();

/**
 * Refund vendor credit drawer provider.
 */
function RefundVendorCreditDrawerProvider({ refundTransactionId, ...props }) {
  // Handle fetch refund credit note transaction.
  const { data: refundVendorTransaction, isLoading: isRefundVendorTransaction } = useRefundVendorCreditTransaction(
    refundTransactionId,
    {
      enabled: !!refundTransactionId,
    },
  );

  // provider
  const provider = {
    refundTransactionId,
    refundVendorTransaction,
  };

  return (
    <DrawerLoading loading={isRefundVendorTransaction}>
      <DrawerHeaderContent
        name={DRAWERS.REFUND_VENDOR_CREDIT_DETAILS}
        title={intl.get('refund_vendor_credit.drawer.title')}
      />
      <RefundVendorCreditDrawerContent.Provider value={provider} {...props} />
    </DrawerLoading>
  );
}

const useRefundVendorCreditNoteDrawerContext = () => React.useContext(RefundVendorCreditDrawerContent);

export { RefundVendorCreditDrawerProvider, useRefundVendorCreditNoteDrawerContext };
