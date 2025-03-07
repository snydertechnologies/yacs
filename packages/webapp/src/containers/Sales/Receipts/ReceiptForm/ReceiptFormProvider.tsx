import { DashboardInsider } from '@bigcapital/webapp/components/Dashboard';
import { Features } from '@bigcapital/webapp/constants';
import { useProjects } from '@bigcapital/webapp/containers/Projects/hooks';
import {
  useAccounts,
  useBranches,
  useCreateReceipt,
  useCustomers,
  useEditReceipt,
  useItems,
  useReceipt,
  useSettingsReceipts,
  useWarehouses,
} from '@bigcapital/webapp/hooks/query';
import { useFeatureCan } from '@bigcapital/webapp/hooks/state';
// @ts-nocheck
import React, { createContext, useState } from 'react';

const ReceiptFormContext = createContext();

/**
 * Receipt form provider.
 */
function ReceiptFormProvider({ receiptId, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);
  const isBranchFeatureCan = featureCan(Features.Branches);
  const isProjectsFeatureCan = featureCan(Features.Projects);

  // Fetch sale receipt details.
  const { data: receipt, isLoading: isReceiptLoading } = useReceipt(receiptId, {
    enabled: !!receiptId,
  });
  // Fetch accounts list.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Fetch customers list.
  const {
    data: { customers },
    isLoading: isCustomersLoading,
  } = useCustomers({ page_size: 10000 });

  // Fetch warehouses list.
  const {
    data: warehouses,
    isLoading: isWarehouesLoading,
    isSuccess: isWarehousesSuccess,
  } = useWarehouses({}, { enabled: isWarehouseFeatureCan });

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches({}, { enabled: isBranchFeatureCan });

  // Filter all sellable items only.
  const stringifiedFilterRoles = React.useMemo(
    () =>
      JSON.stringify([
        {
          index: 1,
          fieldKey: 'sellable',
          value: true,
          condition: '&&',
          comparator: 'equals',
        },
        {
          index: 2,
          fieldKey: 'active',
          value: true,
          condition: '&&',
          comparator: 'equals',
        },
      ]),
    [],
  );

  // Handle fetch Items data table or list
  const {
    data: { items },
    isLoading: isItemsLoading,
  } = useItems({
    page_size: 10000,
    stringified_filter_roles: stringifiedFilterRoles,
  });

  // Fetch project list.
  const {
    data: { projects },
    isLoading: isProjectsLoading,
  } = useProjects({}, { enabled: !!isProjectsFeatureCan });

  // Fetch receipt settings.
  const { isLoading: isSettingLoading } = useSettingsReceipts();

  const { mutateAsync: createReceiptMutate } = useCreateReceipt();
  const { mutateAsync: editReceiptMutate } = useEditReceipt();

  const [submitPayload, setSubmitPayload] = useState({});

  const isNewMode = !receiptId;

  const isFeatureLoading = isWarehouesLoading || isBranchesLoading;

  const provider = {
    receiptId,
    receipt,
    accounts,
    customers,
    items,
    branches,
    warehouses,
    projects,
    submitPayload,

    isNewMode,
    isReceiptLoading,
    isAccountsLoading,
    isCustomersLoading,
    isItemsLoading,
    isWarehouesLoading,
    isBranchesLoading,
    isFeatureLoading,
    isSettingLoading,
    isBranchesSuccess,
    isWarehousesSuccess,

    createReceiptMutate,
    editReceiptMutate,
    setSubmitPayload,
  };
  return (
    <DashboardInsider
      loading={isReceiptLoading || isAccountsLoading || isCustomersLoading || isItemsLoading || isSettingLoading}
      name={'receipt-form'}
    >
      <ReceiptFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useReceiptFormContext = () => React.useContext(ReceiptFormContext);

export { ReceiptFormProvider, useReceiptFormContext };
