// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { FinancialSheet, ReportDataTable } from '@bigcapital/webapp/components';
import { TableStyle } from '@bigcapital/webapp/constants';
import { tableRowTypesToClassnames } from '@bigcapital/webapp/utils';
import { useSalesByItemsContext } from './SalesByItemProvider';
import { useSalesByItemsTableColumns } from './dynamicColumns';

/**
 * Sales by items data table.
 */
export default function SalesByItemsTable({ companyName }) {
  // Sales by items context.
  const {
    salesByItems: { table, query },
    isLoading,
  } = useSalesByItemsContext();

  // Sales by items table columns.
  const columns = useSalesByItemsTableColumns();

  return (
    <SalesByItemsSheet
      companyName={companyName}
      sheetType={intl.get('sales_by_items')}
      fromDate={query.from_date}
      toDate={query.to_date}
      loading={isLoading}
    >
      <SalesByItemsDataTable
        columns={columns}
        data={table.rows}
        expandable={true}
        expandToggleColumn={1}
        expandColumnSpace={1}
        sticky={true}
        rowClassNames={tableRowTypesToClassnames}
        noResults={intl.get('there_were_no_sales_during_the_selected_date_range')}
        styleName={TableStyle.Constrant}
      />
    </SalesByItemsSheet>
  );
}

const SalesByItemsSheet = styled(FinancialSheet)`
  min-width: 850px;
`;

const SalesByItemsDataTable = styled(ReportDataTable)`
  .table {
    .tbody {
      .tr .td {
        border-bottom: 0;
        padding-top: 0.4rem;
        padding-bottom: 0.4rem;
      }
      .tr.row_type--TOTAL .td {
        border-top: 1px solid #bbb;
        font-weight: 500;
        border-bottom: 3px double #000;
      }
    }
  }
`;
