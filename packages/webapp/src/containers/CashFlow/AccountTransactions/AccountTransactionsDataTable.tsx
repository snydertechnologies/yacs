// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import {
  DataTable,
  FormattedMessage as T,
  TableFastCell,
  TableSkeletonHeader,
  TableSkeletonRows,
  TableVirtualizedListRows,
} from '@bigcapital/webapp/components';
import { TABLES } from '@bigcapital/webapp/constants/tables';

import withAlertsActions from '@bigcapital/webapp/containers/Alert/withAlertActions';
import withDrawerActions from '@bigcapital/webapp/containers/Drawer/withDrawerActions';
import withSettings from '@bigcapital/webapp/containers/Settings/withSettings';

import { useMemorizedColumnsWidths } from '@bigcapital/webapp/hooks';
import { ActionsMenu, useAccountTransactionsColumns } from './components';
import { handleCashFlowTransactionType } from './utils';

import { compose } from '@bigcapital/webapp/utils';
import { useAccountTransactionsAllContext } from './AccountTransactionsAllBoot';

/**
 * Account transactions data table.
 */
function AccountTransactionsDataTable({
  // #withSettings
  cashflowTansactionsTableSize,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,
}) {
  // Retrieve table columns.
  const columns = useAccountTransactionsColumns();

  // Retrieve list context.
  const { cashflowTransactions, isCashFlowTransactionsLoading } = useAccountTransactionsAllContext();

  // Local storage memorizing columns widths.
  const [initialColumnsWidths, , handleColumnResizing] = useMemorizedColumnsWidths(TABLES.CASHFLOW_Transactions);

  // handle delete transaction
  const handleDeleteTransaction = ({ reference_id }) => {
    openAlert('account-transaction-delete', { referenceId: reference_id });
  };
  // Handle view details action.
  const handleViewDetailCashflowTransaction = (referenceType) => {
    handleCashFlowTransactionType(referenceType, openDrawer);
  };
  // Handle cell click.
  const handleCellClick = (cell, event) => {
    const referenceType = cell.row.original;
    handleCashFlowTransactionType(referenceType, openDrawer);
  };

  return (
    <CashflowTransactionsTable
      noInitialFetch={true}
      columns={columns}
      data={cashflowTransactions}
      sticky={true}
      loading={isCashFlowTransactionsLoading}
      headerLoading={isCashFlowTransactionsLoading}
      expandColumnSpace={1}
      expandToggleColumn={2}
      selectionColumnWidth={45}
      TableCellRenderer={TableFastCell}
      TableLoadingRenderer={TableSkeletonRows}
      TableRowsRenderer={TableVirtualizedListRows}
      TableHeaderSkeletonRenderer={TableSkeletonHeader}
      ContextMenu={ActionsMenu}
      onCellClick={handleCellClick}
      // #TableVirtualizedListRows props.
      vListrowHeight={cashflowTansactionsTableSize == 'small' ? 32 : 40}
      vListOverscanRowCount={0}
      initialColumnsWidths={initialColumnsWidths}
      onColumnResizing={handleColumnResizing}
      noResults={<T id={'cash_flow.account_transactions.no_results'} />}
      className="table-constrant"
      payload={{
        onViewDetails: handleViewDetailCashflowTransaction,
        onDelete: handleDeleteTransaction,
      }}
    />
  );
}

export default compose(
  withSettings(({ cashflowTransactionsSettings }) => ({
    cashflowTansactionsTableSize: cashflowTransactionsSettings?.tableSize,
  })),
  withAlertsActions,
  withDrawerActions,
)(AccountTransactionsDataTable);

const DashboardConstrantTable = styled(DataTable)`
  .table {
    .thead {
      .th {
        background: #fff;
      }
    }

    .tbody {
      .tr:last-child .td {
        border-bottom: 0;
      }
    }
  }
`;

const CashflowTransactionsTable = styled(DashboardConstrantTable)`
  .table .tbody {
    .tbody-inner .tr.no-results {
      .td {
        padding: 2rem 0;
        font-size: 14px;
        color: #888;
        font-weight: 400;
        border-bottom: 0;
      }
    }

    .tbody-inner {
      .tr .td:not(:first-child) {
        border-left: 1px solid #e6e6e6;
      }
    }
  }
`;
