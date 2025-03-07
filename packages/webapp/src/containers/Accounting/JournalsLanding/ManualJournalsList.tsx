// @ts-nocheck
import React from 'react';

import '@bigcapital/webapp/style/pages/ManualJournal/List.scss';

import { DashboardPageContent } from '@bigcapital/webapp/components';
import { compose, transformTableStateToQuery } from '@bigcapital/webapp/utils';

import ManualJournalsActionsBar from './ManualJournalActionsBar';
import ManualJournalsDataTable from './ManualJournalsDataTable';
import { ManualJournalsListProvider } from './ManualJournalsListProvider';
import ManualJournalsViewTabs from './ManualJournalsViewTabs';
import withManualJournals from './withManualJournals';

/**
 * Manual journals table.
 */
function ManualJournalsTable({
  // #withManualJournals
  journalsTableState,
  journalsTableStateChanged,
}) {
  return (
    <ManualJournalsListProvider
      query={transformTableStateToQuery(journalsTableState)}
      tableStateChanged={journalsTableStateChanged}
    >
      <ManualJournalsActionsBar />

      <DashboardPageContent>
        <ManualJournalsViewTabs />
        <ManualJournalsDataTable />
      </DashboardPageContent>
    </ManualJournalsListProvider>
  );
}

export default compose(
  withManualJournals(({ manualJournalsTableState, manualJournalTableStateChanged }) => ({
    journalsTableState: manualJournalsTableState,
    journalsTableStateChanged: manualJournalTableStateChanged,
  })),
)(ManualJournalsTable);
