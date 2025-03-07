import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
// @ts-nocheck
import React from 'react';

import { DashboardActionsBar, Icon, FormattedMessage as T } from '@bigcapital/webapp/components';
import classNames from 'classnames';
import { useAPAgingSummaryContext } from './APAgingSummaryProvider';

import NumberFormatDropdown from '@bigcapital/webapp/components/NumberFormatDropdown';
import { APAgingSummaryExportMenu } from './components';

import withAPAgingSummary from './withAPAgingSummary';
import withAPAgingSummaryActions from './withAPAgingSummaryActions';

import { DialogsName } from '@bigcapital/webapp/constants/dialogs';
import withDialogActions from '@bigcapital/webapp/containers/Dialog/withDialogActions';
import { compose, saveInvoke } from '@bigcapital/webapp/utils';

/**
 * AP Aging summary sheet - Actions bar.
 */
function APAgingSummaryActionsBar({
  // #withPayableAgingSummary
  isFilterDrawerOpen,

  // #withARAgingSummaryActions
  toggleAPAgingSummaryFilterDrawer: toggleFilterDrawerDisplay,

  // #withDialogActions
  openDialog,

  //#ownProps
  numberFormat,
  onNumberFormatSubmit,
}) {
  const { isAPAgingFetching, refetch } = useAPAgingSummaryContext();

  const handleFilterToggleClick = () => {
    toggleFilterDrawerDisplay();
  };

  // handle recalculate report button.
  const handleRecalculateReport = () => {
    refetch();
  };

  // handle number format submit.
  const handleNumberFormatSubmit = (numberFormat) => {
    saveInvoke(onNumberFormatSubmit, numberFormat);
  };

  // Handle the print button click.
  const handlePrintBtnClick = () => {
    openDialog(DialogsName.APAgingSummaryPdfPreview);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={classNames(Classes.MINIMAL, 'button--gray-highlight')}
          text={<T id={'recalc_report'} />}
          onClick={handleRecalculateReport}
          icon={<Icon icon="refresh-16" iconSize={16} />}
        />
        <NavbarDivider />
        <Button
          className={classNames(Classes.MINIMAL, 'button--table-views')}
          icon={<Icon icon="cog-16" iconSize={16} />}
          text={isFilterDrawerOpen ? <T id={'hide_customizer'} /> : <T id={'customize_report'} />}
          onClick={handleFilterToggleClick}
          active={isFilterDrawerOpen}
        />
        <NavbarDivider />
        <Popover
          content={
            <NumberFormatDropdown
              numberFormat={numberFormat}
              onSubmit={handleNumberFormatSubmit}
              submitDisabled={isAPAgingFetching}
            />
          }
          minimal={true}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={<T id={'format'} />}
            icon={<Icon icon="numbers" width={23} height={16} />}
          />
        </Popover>

        <Button className={Classes.MINIMAL} text={<T id={'filter'} />} icon={<Icon icon="filter-16" iconSize={16} />} />
        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
          onClick={handlePrintBtnClick}
        />
        <Popover
          content={<APAgingSummaryExportMenu />}
          interactionKind={PopoverInteractionKind.CLICK}
          placement="bottom-start"
          minimal
        >
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="file-export-16" iconSize={16} />}
            text={<T id={'export'} />}
          />
        </Popover>
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withAPAgingSummaryActions,
  withAPAgingSummary(({ APAgingSummaryFilterDrawer }) => ({
    isFilterDrawerOpen: APAgingSummaryFilterDrawer,
  })),
  withDialogActions,
)(APAgingSummaryActionsBar);
