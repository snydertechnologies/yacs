// @ts-nocheck
import t from '@bigcapital/webapp/store/types';

export const setBillsTableState = (queries) => {
  return {
    type: t.BILLS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetBillsTableState = () => {
  return {
    type: t.BILLS_TABLE_STATE_RESET,
  };
};
