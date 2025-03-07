import { useCustomers } from '@bigcapital/webapp/hooks/query';
// @ts-nocheck
import React, { createContext, useContext } from 'react';
import { FinancialHeaderLoadingSkeleton } from '../FinancialHeaderLoadingSkeleton';

const CustomersTransactionsGeneralPanelContext = createContext();

/**
 * Customers transactions provider.
 */
function CustomersTransactionsGeneralPanelProvider({ ...props }) {
  // Fetches the customers list.
  const {
    data: { customers },
    isFetching: isCustomersFetching,
    isLoading: isCustomersLoading,
  } = useCustomers();

  const provider = {
    customers,
    isCustomersLoading,
    isCustomersFetching,
  };

  const loading = isCustomersLoading;

  return loading ? (
    <FinancialHeaderLoadingSkeleton />
  ) : (
    <CustomersTransactionsGeneralPanelContext.Provider value={provider} {...props} />
  );
}
const useCustomersTransactionsGeneralPanelContext = () => useContext(CustomersTransactionsGeneralPanelContext);

export { CustomersTransactionsGeneralPanelProvider, useCustomersTransactionsGeneralPanelContext };
