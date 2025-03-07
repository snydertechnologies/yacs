import { DashboardActionsBar, DashboardRowsHeightButton, FormattedMessage as T } from '@bigcapital/webapp/components';
import {
  AdvancedFilterPopover,
  Can,
  DashboardActionViewsList,
  DashboardFilterButton,
  Icon,
  If,
} from '@bigcapital/webapp/components';
import { Alignment, Button, Classes, Intent, NavbarDivider, NavbarGroup, Switch } from '@blueprintjs/core';
// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';

import { AbilitySubject, ItemAction } from '@bigcapital/webapp/constants/abilityOption';
import { useRefreshItems } from '@bigcapital/webapp/hooks/query/items';
import { useItemsListContext } from './ItemsListProvider';

import withAlertActions from '@bigcapital/webapp/containers/Alert/withAlertActions';
import withSettings from '@bigcapital/webapp/containers/Settings/withSettings';
import withSettingsActions from '@bigcapital/webapp/containers/Settings/withSettingsActions';
import withDialogActions from '../Dialog/withDialogActions';
import withItems from './withItems';
import withItemsActions from './withItemsActions';

import { DialogsName } from '@bigcapital/webapp/constants/dialogs';
import { compose } from '@bigcapital/webapp/utils';

/**
 * Items actions bar.
 */
function ItemsActionsBar({
  // #withItems
  itemsSelectedRows,
  itemsFilterRoles,

  // #withItemActions
  setItemsTableState,
  itemsInactiveMode,

  // #withAlertActions
  openAlert,

  // #withSettings
  itemsTableSize,

  // #withSettingsActions
  addSetting,

  // #withDialogActions
  openDialog,
}) {
  // Items list context.
  const { itemsViews, fields } = useItemsListContext();

  // Items refresh action.
  const { refresh } = useRefreshItems();

  // History context.
  const history = useHistory();

  // Handle `new item` button click.
  const onClickNewItem = () => {
    history.push('/items/new');
  };

  // Handle tab changing.
  const handleTabChange = (view) => {
    setItemsTableState({ viewSlug: view ? view.slug : null });
  };

  // Handle cancel/confirm items bulk.
  const handleBulkDelete = () => {
    openAlert('items-bulk-delete', { itemsIds: itemsSelectedRows });
  };

  // Handle inactive switch changing.
  const handleInactiveSwitchChange = (event) => {
    const checked = event.target.checked;
    setItemsTableState({ inactiveMode: checked });
  };
  // Handle refresh button click.
  const handleRefreshBtnClick = () => {
    refresh();
  };
  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('items', 'tableSize', size);
  };
  // Handles the import button click.
  const handleImportBtnClick = () => {
    history.push('/items/import');
  };

  // Handle the export button click.
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'item' });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'items'}
          allMenuItem={true}
          allMenuItemText={<T id={'all_items'} />}
          views={itemsViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />

        <Can I={ItemAction.Create} a={AbilitySubject.Item}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="plus" />}
            text={<T id={'new_item'} />}
            onClick={onClickNewItem}
          />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: itemsFilterRoles,
            defaultFieldKey: 'name',
            fields: fields,
            onFilterChange: (filterConditions) => {
              setItemsTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton conditionsCount={itemsFilterRoles.length} />
        </AdvancedFilterPopover>

        <NavbarDivider />

        <If condition={itemsSelectedRows.length}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
          />
        </If>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-import-16" iconSize={16} />}
          onClick={handleImportBtnClick}
          text={<T id={'import'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
          onClick={handleExportBtnClick}
        />
        <NavbarDivider />
        <DashboardRowsHeightButton initialValue={itemsTableSize} onChange={handleTableRowSizeChange} />
        <NavbarDivider />
        <Can I={ItemAction.Edit} a={AbilitySubject.Item}>
          <Switch
            labelElement={<T id={'inactive'} />}
            defaultChecked={itemsInactiveMode}
            onChange={handleInactiveSwitchChange}
          />
        </Can>
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
  withSettingsActions,
  withItems(({ itemsSelectedRows, itemsTableState }) => ({
    itemsSelectedRows,
    itemsInactiveMode: itemsTableState.inactiveMode,
    itemsFilterRoles: itemsTableState.filterRoles,
  })),
  withSettings(({ itemsSettings }) => ({
    itemsTableSize: itemsSettings.tableSize,
  })),
  withItemsActions,
  withAlertActions,
  withDialogActions,
)(ItemsActionsBar);
