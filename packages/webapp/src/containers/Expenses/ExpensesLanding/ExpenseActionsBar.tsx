import { Alignment, Button, Classes, Intent, NavbarDivider, NavbarGroup } from '@blueprintjs/core';
// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  AdvancedFilterPopover,
  Can,
  DashboardActionViewsList,
  DashboardActionsBar,
  DashboardFilterButton,
  DashboardRowsHeightButton,
  Icon,
  If,
  FormattedMessage as T,
} from '@bigcapital/webapp/components';

import { AbilitySubject, ExpenseAction } from '@bigcapital/webapp/constants/abilityOption';
import { useRefreshExpenses } from '@bigcapital/webapp/hooks/query/expenses';
import { useExpensesListContext } from './ExpensesListProvider';

import withDialogActions from '@bigcapital/webapp/containers/Dialog/withDialogActions';
import withSettings from '@bigcapital/webapp/containers/Settings/withSettings';
import withSettingsActions from '@bigcapital/webapp/containers/Settings/withSettingsActions';
import withExpenses from './withExpenses';
import withExpensesActions from './withExpensesActions';

import { DialogsName } from '@bigcapital/webapp/constants/dialogs';
import { compose } from '@bigcapital/webapp/utils';

/**
 * Expenses actions bar.
 */
function ExpensesActionsBar({
  //#withExpensesActions
  setExpensesTableState,

  // #withExpenses
  expensesFilterConditions,

  // #withSettings
  expensesTableSize,

  // #withSettingsActions
  addSetting,

  // #withDialogActions
  openDialog,
}) {
  // History context.
  const history = useHistory();

  // Expenses list context.
  const { expensesViews, fields } = useExpensesListContext();

  // Expenses refresh action.
  const { refresh } = useRefreshExpenses();

  // Handles the new expense buttn click.
  const onClickNewExpense = () => {
    history.push('/expenses/new');
  };
  // Handle delete button click.
  const handleBulkDelete = () => {};

  // Handles the tab chaning.
  const handleTabChange = (view) => {
    setExpensesTableState({
      viewSlug: view ? view.slug : null,
    });
  };
  // Handle click a refresh
  const handleRefreshBtnClick = () => {
    refresh();
  };
  // Handle the import button click.
  const handleImportBtnClick = () => {
    history.push('/expenses/import');
  };
  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('expenses', 'tableSize', size);
  };
  // Handle the export button click.
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'expense' });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'expenses'}
          views={expensesViews}
          allMenuItem={true}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={ExpenseAction.Create} a={AbilitySubject.Expense}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="plus" />}
            text={<T id={'new_expense'} />}
            onClick={onClickNewExpense}
          />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: expensesFilterConditions,
            defaultFieldKey: 'reference_no',
            fields: fields,
            onFilterChange: (filterConditions) => {
              setExpensesTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton conditionsCount={expensesFilterConditions.length} />
        </AdvancedFilterPopover>

        <If condition={false}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
          />
        </If>

        <Button className={Classes.MINIMAL} icon={<Icon icon="print-16" iconSize={16} />} text={<T id={'print'} />} />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-import-16" iconSize={16} />}
          text={<T id={'import'} />}
          onClick={handleImportBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
          onClick={handleExportBtnClick}
        />
        <NavbarDivider />
        <DashboardRowsHeightButton initialValue={expensesTableSize} onChange={handleTableRowSizeChange} />
        <NavbarDivider />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="refresh-16" iconSize={14} />}
          onClick={handleRefreshBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withExpensesActions,
  withSettingsActions,
  withExpenses(({ expensesTableState }) => ({
    expensesFilterConditions: expensesTableState.filterRoles,
  })),
  withSettings(({ expenseSettings }) => ({
    expensesTableSize: expenseSettings?.tableSize,
  })),
)(ExpensesActionsBar);
