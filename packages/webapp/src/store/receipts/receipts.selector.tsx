// @ts-nocheck
import { isEqual } from 'lodash';

import { paginationLocationQuery } from '@bigcapital/webapp/store/selectors';
import { createDeepEqualSelector } from '@bigcapital/webapp/utils';
import { defaultTableQuery } from './receipts.reducer';

const receiptTableStateSelector = (state) => state.salesReceipts.tableState;

// Retrieve receipts table query.
export const getReceiptsTableStateFactory = () =>
  createDeepEqualSelector(paginationLocationQuery, receiptTableStateSelector, (locationQuery, tableState) => {
    return {
      ...locationQuery,
      ...tableState,
    };
  });

export const receiptsTableStateChangedFactory = () =>
  createDeepEqualSelector(receiptTableStateSelector, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });
