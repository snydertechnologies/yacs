import { MenuItem } from '@blueprintjs/core';
// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { Choose, Icon, T } from '@bigcapital/webapp/components';
import { AbilitySubject, SaleReceiptAction } from '@bigcapital/webapp/constants/abilityOption';
import { DRAWERS } from '@bigcapital/webapp/constants/drawers';
import { RESOURCES_TYPES } from '@bigcapital/webapp/constants/resourcesTypes';
import withDrawerActions from '@bigcapital/webapp/containers/Drawer/withDrawerActions';

/**
 * Receipt universal search item select action.
 */
function ReceiptUniversalSearchSelectComponent({
  // #ownProps
  resourceType,
  resourceId,
  onAction,

  // #withDrawerActions
  openDrawer,
}) {
  if (resourceType === RESOURCES_TYPES.RECEIPT) {
    openDrawer(DRAWERS.RECEIPT_DETAILS, { receiptId: resourceId });
    onAction && onAction();
  }
  return null;
}

export const ReceiptUniversalSearchSelect = withDrawerActions(ReceiptUniversalSearchSelectComponent);

/**
 * Status accessor.
 */
function ReceiptStatus({ receipt }) {
  return (
    <Choose>
      <Choose.When condition={receipt.is_closed}>
        <span className="closed">
          <T id={'closed'} />
        </span>
      </Choose.When>

      <Choose.Otherwise>
        <span className="draft">
          <T id={'draft'} />
        </span>
      </Choose.Otherwise>
    </Choose>
  );
}

/**
 * Receipt universal search item.
 */
export function ReceiptUniversalSearchItem(item, { handleClick, modifiers, query }) {
  return (
    <MenuItem
      active={modifiers.active}
      text={
        <div>
          <div>{item.text}</div>
          <span className="bp4-text-muted">
            {item.reference.receipt_number} <Icon icon={'caret-right-16'} iconSize={16} />
            {item.reference.formatted_receipt_date}
          </span>
        </div>
      }
      label={
        <>
          <div className="amount">{item.reference.formatted_amount}</div>
          <ReceiptStatus receipt={item.reference} />
        </>
      }
      onClick={handleClick}
      className={'universal-search__item--receipt'}
    />
  );
}

/**
 * Transformes receipt resource item to search item.
 */
const transformReceiptsToSearch = (receipt) => ({
  id: receipt.id,
  text: receipt.customer.display_name,
  label: receipt.formatted_amount,
  reference: receipt,
});

/**
 * Receipt universal search bind configuration.
 */
export const universalSearchReceiptBind = () => ({
  resourceType: RESOURCES_TYPES.RECEIPT,
  optionItemLabel: intl.get('receipts'),
  selectItemAction: ReceiptUniversalSearchSelect,
  itemRenderer: ReceiptUniversalSearchItem,
  itemSelect: transformReceiptsToSearch,
  permission: {
    ability: SaleReceiptAction.View,
    subject: AbilitySubject.Receipt,
  },
});
