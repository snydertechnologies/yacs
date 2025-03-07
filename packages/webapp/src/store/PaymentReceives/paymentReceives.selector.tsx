// @ts-nocheck
import { createSelector } from '@reduxjs/toolkit';
import { isEqual } from 'lodash';

import { paginationLocationQuery } from '@bigcapital/webapp/store/selectors';
import { createDeepEqualSelector } from '@bigcapital/webapp/utils';
import { defaultTableQuery } from './paymentReceives.reducer';

const paymentReceiveTableState = (state) => state.paymentReceives.tableState;

// Retrieve payment receives table fetch query.
export const getPaymentReceiveTableStateFactory = () =>
  createSelector(paginationLocationQuery, paymentReceiveTableState, (locationQuery, tableState) => {
    return {
      ...locationQuery,
      ...tableState,
    };
  });
export const paymentsTableStateChangedFactory = () =>
  createDeepEqualSelector(paymentReceiveTableState, (tableState) => {
    return !isEqual(tableState, defaultTableQuery);
  });
