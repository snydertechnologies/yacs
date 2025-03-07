// @ts-nocheck
import t from '@bigcapital/webapp/store/types';

export const setProjectsTableState = (queries) => {
  return {
    type: t.PROJECTS_TABLE_STATE_SET,
    payload: { queries },
  };
};

export const resetProjectsTableState = () => {
  return {
    type: t.PROJECTS_TABLE_STATE_RESET,
  };
};
