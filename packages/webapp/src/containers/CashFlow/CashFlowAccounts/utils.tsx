// @ts-nocheck
import { transformTableStateToQuery } from '@bigcapital/webapp/utils';

/**
 * Transformes the table state to list query.
 */
export const transformAccountsStateToQuery = (tableState) => {
  return {
    ...transformTableStateToQuery(tableState),
    inactive_mode: tableState.inactiveMode,
  };
};
