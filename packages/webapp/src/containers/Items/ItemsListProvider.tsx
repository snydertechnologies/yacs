import { DashboardInsider } from '@bigcapital/webapp/components';
import { useItems, useResourceMeta, useResourceViews } from '@bigcapital/webapp/hooks/query';
import { getFieldsFromResourceMeta, transformTableQueryToParams } from '@bigcapital/webapp/utils';
import { isEmpty } from 'lodash';
// @ts-nocheck
import React, { createContext } from 'react';
import { transformItemsTableState } from './utils';

const ItemsContext = createContext();

/**
 * Items list provider.
 */
function ItemsListProvider({ tableState, tableStateChanged, ...props }) {
  const tableQuery = transformItemsTableState(tableState);

  // Fetch accounts resource views and fields.
  const { data: itemsViews, isLoading: isViewsLoading } = useResourceViews('items');

  // Fetch the accounts resource fields.
  const { data: resourceMeta, isLoading: isResourceLoading, isFetching: isResourceFetching } = useResourceMeta('items');

  // Handle fetching the items table based on the given query.
  const {
    data: { items, pagination, filterMeta },
    isFetching: isItemsFetching,
    isLoading: isItemsLoading,
  } = useItems(
    {
      ...transformTableQueryToParams(tableQuery),
    },
    { keepPreviousData: true },
  );

  // Detarmines the datatable empty status.
  const isEmptyStatus = !tableStateChanged && !isItemsLoading && isEmpty(items);

  const state = {
    itemsViews,
    items,
    pagination,

    fields: getFieldsFromResourceMeta(resourceMeta.fields),

    isViewsLoading,
    isItemsLoading,
    isItemsFetching: isItemsFetching,
    isResourceLoading,
    isResourceFetching,

    isEmptyStatus,
  };

  return (
    <DashboardInsider loading={isViewsLoading || isResourceLoading} name={'items-list'}>
      <ItemsContext.Provider value={state} {...props} />
    </DashboardInsider>
  );
}

const useItemsListContext = () => React.useContext(ItemsContext);

export { ItemsListProvider, useItemsListContext };
