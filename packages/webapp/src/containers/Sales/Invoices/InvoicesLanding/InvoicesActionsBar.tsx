import {
  AdvancedFilterPopover,
  DashboardActionsBar,
  DashboardFilterButton,
  DashboardRowsHeightButton,
  Icon,
  FormattedMessage as T,
} from '@bigcapital/webapp/components';
import { Alignment, Button, Classes, Intent, NavbarDivider, NavbarGroup } from '@blueprintjs/core';
// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';

import { Can, DashboardActionViewsList, If } from '@bigcapital/webapp/components';
import { AbilitySubject, SaleInvoiceAction } from '@bigcapital/webapp/constants/abilityOption';

import { useRefreshInvoices } from '@bigcapital/webapp/hooks/query/invoices';
import { useInvoicesListContext } from './InvoicesListProvider';

import { DialogsName } from '@bigcapital/webapp/constants/dialogs';
import withDialogActions from '@bigcapital/webapp/containers/Dialog/withDialogActions';
import withSettings from '@bigcapital/webapp/containers/Settings/withSettings';
import withSettingsActions from '@bigcapital/webapp/containers/Settings/withSettingsActions';
import { compose } from '@bigcapital/webapp/utils';
import withInvoiceActions from './withInvoiceActions';
import withInvoices from './withInvoices';

/**
 * Invoices table actions bar.
 */
function InvoiceActionsBar({
  // #withInvoiceActions
  setInvoicesTableState,

  // #withInvoices
  invoicesFilterRoles,

  // #withSettings
  invoicesTableSize,

  // #withSettingsActions
  addSetting,

  // #withDialogsActions
  openDialog,
}) {
  const history = useHistory();

  // Sale invoices list context.
  const { invoicesViews, invoicesFields } = useInvoicesListContext();

  // Handle new invoice button click.
  const handleClickNewInvoice = () => {
    history.push('/invoices/new');
  };

  // Invoices refresh action.
  const { refresh } = useRefreshInvoices();

  // Handle views tab change.
  const handleTabChange = (view) => {
    setInvoicesTableState({ viewSlug: view ? view.slug : null });
  };

  // Handle click a refresh sale invoices
  const handleRefreshBtnClick = () => {
    refresh();
  };

  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('salesInvoices', 'tableSize', size);
  };

  // Handle the import button click.
  const handleImportBtnClick = () => {
    history.push('/invoices/import');
  };

  // Handle the export button click.
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'sale_invoice' });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          allMenuItem={true}
          resourceName={'invoices'}
          views={invoicesViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={SaleInvoiceAction.Create} a={AbilitySubject.Invoice}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus'} />}
            text={<T id={'new_invoice'} />}
            onClick={handleClickNewInvoice}
          />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: invoicesFilterRoles,
            defaultFieldKey: 'invoice_no',
            fields: invoicesFields,
            onFilterChange: (filterConditions) => {
              setInvoicesTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton conditionsCount={invoicesFilterRoles.length} />
        </AdvancedFilterPopover>

        <NavbarDivider />

        <If condition={false}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
          />
        </If>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'print-16'} iconSize={'16'} />}
          text={<T id={'print'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-import-16'} />}
          text={<T id={'import'} />}
          onClick={handleImportBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-export-16'} iconSize={'16'} />}
          text={<T id={'export'} />}
          onClick={handleExportBtnClick}
        />
        <NavbarDivider />
        <DashboardRowsHeightButton initialValue={invoicesTableSize} onChange={handleTableRowSizeChange} />
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
  withInvoiceActions,
  withSettingsActions,
  withInvoices(({ invoicesTableState }) => ({
    invoicesFilterRoles: invoicesTableState.filterRoles,
  })),
  withSettings(({ invoiceSettings }) => ({
    invoicesTableSize: invoiceSettings?.tableSize,
  })),
  withDialogActions,
)(InvoiceActionsBar);
