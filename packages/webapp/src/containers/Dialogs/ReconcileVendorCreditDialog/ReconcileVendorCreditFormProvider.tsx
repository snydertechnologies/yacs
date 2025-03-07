import { DialogContent } from '@bigcapital/webapp/components';
import {
  useCreateReconcileVendorCredit,
  useReconcileVendorCredit,
  useVendorCredit,
} from '@bigcapital/webapp/hooks/query';
import { isEmpty } from 'lodash';
// @ts-nocheck
import React from 'react';

const ReconcileVendorCreditFormContext = React.createContext();

/**
 * Reconcile vendor credit provider.
 */
function ReconcileVendorCreditFormProvider({ vendorCreditId, dialogName, ...props }) {
  // Handle fetch reconcile
  const { isLoading: isReconcileVendorCreditLoading, data: reconcileVendorCredits } = useReconcileVendorCredit(
    vendorCreditId,
    {
      enabled: !!vendorCreditId,
    },
  );

  // Handle fetch vendor credit details.
  const { data: vendorCredit, isLoading: isVendorCreditLoading } = useVendorCredit(vendorCreditId, {
    enabled: !!vendorCreditId,
  });

  // Create reconcile vendor credit mutations.
  const { mutateAsync: createReconcileVendorCreditMutate } = useCreateReconcileVendorCredit();

  // Detarmines the datatable empty status.
  const isEmptyStatus = isEmpty(reconcileVendorCredits);

  // provider.
  const provider = {
    dialogName,
    reconcileVendorCredits,
    createReconcileVendorCreditMutate,
    isEmptyStatus,
    vendorCredit,
  };

  return (
    <DialogContent isLoading={isVendorCreditLoading || isReconcileVendorCreditLoading} name={'reconcile-vendor-credit'}>
      <ReconcileVendorCreditFormContext.Provider value={provider} {...props} />
    </DialogContent>
  );
}

const useReconcileVendorCreditContext = () => React.useContext(ReconcileVendorCreditFormContext);

export { ReconcileVendorCreditFormProvider, useReconcileVendorCreditContext };
