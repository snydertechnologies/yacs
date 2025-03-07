import { MenuItem } from '@blueprintjs/core';
// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { Choose, Icon, T } from '@bigcapital/webapp/components';
import { highlightText } from '@bigcapital/webapp/utils';

import { AbilitySubject, SaleInvoiceAction } from '@bigcapital/webapp/constants/abilityOption';
import { DRAWERS } from '@bigcapital/webapp/constants/drawers';
import { RESOURCES_TYPES } from '@bigcapital/webapp/constants/resourcesTypes';
import withDrawerActions from '@bigcapital/webapp/containers/Drawer/withDrawerActions';

/**
 * Universal search invoice item select action.
 */
function InvoiceUniversalSearchSelectComponent({
  // #ownProps
  resourceType,
  resourceId,

  // #withDrawerActions
  openDrawer,
}) {
  if (resourceType === RESOURCES_TYPES.INVOICE) {
    openDrawer(DRAWERS.INVOICE_DETAILS, { invoiceId: resourceId });
  }
  return null;
}

export const InvoiceUniversalSearchSelect = withDrawerActions(InvoiceUniversalSearchSelectComponent);

/**
 * Invoice status.
 */
function InvoiceStatus({ customer }) {
  return (
    <Choose>
      <Choose.When condition={customer.is_fully_paid && customer.is_delivered}>
        <span className="status status-success">
          <T id={'paid'} />
        </span>
      </Choose.When>

      <Choose.When condition={customer.is_delivered}>
        <Choose>
          <Choose.When condition={customer.is_overdue}>
            <span className={'status status-warning'}>
              {intl.get('overdue_by', { overdue: customer.overdue_days })}
            </span>
          </Choose.When>
          <Choose.Otherwise>
            <span className={'status status-warning'}>{intl.get('due_in', { due: customer.remaining_days })}</span>
          </Choose.Otherwise>
        </Choose>
      </Choose.When>
      <Choose.Otherwise>
        <span className="status status--gray">
          <T id={'draft'} />
        </span>
      </Choose.Otherwise>
    </Choose>
  );
}

/**
 * Universal search invoice item.
 */
export function InvoiceUniversalSearchItem(item, { handleClick, modifiers, query }) {
  return (
    <MenuItem
      active={modifiers.active}
      text={
        <div>
          <div>{highlightText(item.text, query)}</div>
          <span className="bp4-text-muted">
            {highlightText(item.reference.invoice_no, query)} <Icon icon={'caret-right-16'} iconSize={16} />
            {item.reference.invoice_date_formatted}
          </span>
        </div>
      }
      label={
        <>
          <div className="amount">{item.reference.total_formatted}</div>
          <InvoiceStatus customer={item.reference} />
        </>
      }
      onClick={handleClick}
      className={'universal-search__item--invoice'}
    />
  );
}

/**
 * Transformes invoices to search.
 * @param {*} invoice
 * @returns
 */
const transformInvoicesToSearch = (invoice) => ({
  id: invoice.id,
  text: invoice.customer.display_name,
  label: invoice.formatted_balance,
  reference: invoice,
});

/**
 * Binds universal search invoice configure.
 */
export const universalSearchInvoiceBind = () => ({
  resourceType: RESOURCES_TYPES.INVOICE,
  optionItemLabel: intl.get('invoices'),
  selectItemAction: InvoiceUniversalSearchSelect,
  itemRenderer: InvoiceUniversalSearchItem,
  itemSelect: transformInvoicesToSearch,
  permission: {
    ability: SaleInvoiceAction.View,
    subject: AbilitySubject.Invoice,
  },
});
