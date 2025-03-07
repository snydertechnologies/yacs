// @ts-nocheck
import intl from 'react-intl-universal';

import withDrawerActions from '@bigcapital/webapp/containers/Drawer/withDrawerActions';

import { AbilitySubject, AccountAction } from '@bigcapital/webapp/constants/abilityOption';
import { DRAWERS } from '@bigcapital/webapp/constants/drawers';
import { RESOURCES_TYPES } from '@bigcapital/webapp/constants/resourcesTypes';

function AccountUniversalSearchItemSelectComponent({
  // #ownProps
  resourceType,
  resourceId,
  onAction,

  // #withDrawerActions
  openDrawer,
}) {
  if (resourceType === RESOURCES_TYPES.ACCOUNT) {
    openDrawer(DRAWERS.ACCOUNT_DETAILS, { accountId: resourceId });
    onAction && onAction();
  }
  return null;
}

export const AccountUniversalSearchItemSelect = withDrawerActions(AccountUniversalSearchItemSelectComponent);

/**
 * Transformes account item to search item.
 * @param {*} account
 * @returns
 */
const accountToSearch = (account) => ({
  id: account.id,
  text: `${account.name} - ${account.code}`,
  label: account.formatted_amount,
  reference: account,
});

/**
 * Binds universal search account configure.
 */
export const universalSearchAccountBind = () => ({
  resourceType: RESOURCES_TYPES.ACCOUNT,
  optionItemLabel: intl.get('accounts'),
  selectItemAction: AccountUniversalSearchItemSelect,
  itemSelect: accountToSearch,
  permission: {
    ability: AccountAction.View,
    subject: AbilitySubject.Account,
  },
});
