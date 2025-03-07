// @ts-nocheck
import t from '@bigcapital/webapp/store/types';

export const setVendorsTableState = (queries) => {
  return {
    type: t.VENDORS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetVendorsTableState = () => {
  return {
    type: t.VENDORS_TABLE_STATE_RESET,
  };
};
