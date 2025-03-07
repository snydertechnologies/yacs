import { isEmpty } from 'lodash';
// @ts-nocheck
import React, { createContext } from 'react';

import { DashboardInsider } from '@bigcapital/webapp/components/Dashboard';

import { useEstimates, useResourceMeta, useResourceViews } from '@bigcapital/webapp/hooks/query';
import { getFieldsFromResourceMeta } from '@bigcapital/webapp/utils';

// Estimates list context.
const EstimatesListContext = createContext();

/**
 * Sale estimates data provider.
 */
function EstimatesListProvider({ query, tableStateChanged, ...props }) {
  // Fetches estimates resource views and fields.
  const { data: estimatesViews, isLoading: isViewsLoading } = useResourceViews('sale_estimates');

  // Fetches the estimates resource fields.
  const {
    data: resourceMeta,
    isLoading: isResourceLoading,
    isFetching: isResourceFetching,
  } = useResourceMeta('sale_estimates');

  // Fetches estimates list according to the given custom view id.
  const {
    data: { estimates, pagination, filterMeta },
    isLoading: isEstimatesLoading,
    isFetching: isEstimatesFetching,
  } = useEstimates(query, { keepPreviousData: true });

  // Detarmines the datatable empty status.
  const isEmptyStatus = !isEstimatesLoading && !tableStateChanged && isEmpty(estimates);

  // Provider payload.
  const provider = {
    estimates,
    pagination,

    fields: getFieldsFromResourceMeta(resourceMeta.fields),
    estimatesViews,

    isResourceLoading,
    isResourceFetching,

    isEstimatesLoading,
    isEstimatesFetching,
    isViewsLoading,

    isEmptyStatus,
  };

  return (
    <DashboardInsider loading={isViewsLoading || isResourceLoading} name={'sale_estimate'}>
      <EstimatesListContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const useEstimatesListContext = () => React.useContext(EstimatesListContext);

export { EstimatesListProvider, useEstimatesListContext };
