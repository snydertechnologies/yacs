import { MenuItem } from '@blueprintjs/core';
// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { Icon } from '@bigcapital/webapp/components';
import { AbilitySubject, PaymentReceiveAction } from '@bigcapital/webapp/constants/abilityOption';
import { DRAWERS } from '@bigcapital/webapp/constants/drawers';
import { RESOURCES_TYPES } from '@bigcapital/webapp/constants/resourcesTypes';
import withDrawerActions from '@bigcapital/webapp/containers/Drawer/withDrawerActions';
import { highlightText } from '@bigcapital/webapp/utils';

/**
 * Payment receive universal search item select action.
 */
function PaymentReceiveUniversalSearchSelectComponent({
  // #ownProps
  resourceType,
  resourceId,

  // #withDrawerActions
  openDrawer,
}) {
  if (resourceType === RESOURCES_TYPES.PAYMENT_RECEIVE) {
    openDrawer(DRAWERS.PAYMENT_RECEIVE_DETAILS, {
      paymentReceiveId: resourceId,
    });
  }
  return null;
}

export const PaymentReceiveUniversalSearchSelect = withDrawerActions(PaymentReceiveUniversalSearchSelectComponent);

/**
 * Payment receive universal search item.
 */
export function PaymentReceiveUniversalSearchItem(item, { handleClick, modifiers, query }) {
  return (
    <MenuItem
      active={modifiers.active}
      text={
        <div>
          <div>{highlightText(item.text, query)}</div>

          <span className="bp4-text-muted">
            {highlightText(item.reference.payment_receive_no, query)} <Icon icon={'caret-right-16'} iconSize={16} />
            {highlightText(item.reference.formatted_payment_date, query)}
          </span>
        </div>
      }
      label={<div className="amount">{item.reference.formatted_amount}</div>}
      onClick={handleClick}
      className={'universal-search__item--invoice'}
    />
  );
}

/**
 * Transformes payment receives to search.
 */
const paymentReceivesToSearch = (payment) => ({
  id: payment.id,
  text: payment.customer.display_name,
  subText: payment.formatted_payment_date,
  label: payment.formatted_amount,
  reference: payment,
});

/**
 * Binds universal search payment receive configure.
 */
export const universalSearchPaymentReceiveBind = () => ({
  resourceType: RESOURCES_TYPES.PAYMENT_RECEIVE,
  optionItemLabel: intl.get('payment_receives'),
  selectItemAction: PaymentReceiveUniversalSearchSelect,
  itemRenderer: PaymentReceiveUniversalSearchItem,
  itemSelect: paymentReceivesToSearch,
  permission: {
    ability: PaymentReceiveAction.View,
    subject: AbilitySubject.PaymentReceive,
  },
});
