// @ts-nocheck
import { createContext, useContext, useMemo } from 'react';

import { useAPAgingSummaryReport } from '@bigcapital/webapp/hooks/query';
import FinancialReportPage from '../FinancialReportPage';
import { transformFilterFormToQuery } from '../common';

const APAgingSummaryContext = createContext();

/**
 * A/P aging summary provider.
 */
function APAgingSummaryProvider({ filter, ...props }) {
  // Transformers the filter from to the Url query.
  const httpQuery = useMemo(() => transformFilterFormToQuery(filter), [filter]);

  const {
    data: APAgingSummary,
    isLoading: isAPAgingLoading,
    isFetching: isAPAgingFetching,
    refetch,
  } = useAPAgingSummaryReport(httpQuery, { keepPreviousData: true });

  const provider = {
    APAgingSummary,
    isAPAgingLoading,
    isAPAgingFetching,
    refetch,
    query: httpQuery,
    httpQuery,
  };

  return (
    <FinancialReportPage name={'AP-Aging-Summary'}>
      <APAgingSummaryContext.Provider value={provider} {...props} />
    </FinancialReportPage>
  );
}

const useAPAgingSummaryContext = () => useContext(APAgingSummaryContext);

export { APAgingSummaryProvider, useAPAgingSummaryContext };
