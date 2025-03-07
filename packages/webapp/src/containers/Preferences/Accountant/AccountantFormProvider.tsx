import classNames from 'classnames';
// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { Card } from '@bigcapital/webapp/components';
import { CLASSES } from '@bigcapital/webapp/constants/classes';
import { useAccounts, useSaveSettings, useSettings } from '@bigcapital/webapp/hooks/query';
import PreferencesPageLoader from '../PreferencesPageLoader';

const AccountantFormContext = React.createContext();

/**
 * Accountant data provider.
 */
function AccountantFormProvider({ ...props }) {
  // Fetches the accounts list.
  const { isLoading: isAccountsLoading, data: accounts } = useAccounts();

  // Fetches Organization Settings.
  const { isLoading: isSettingsLoading } = useSettings();

  // Save Organization Settings.
  const { mutateAsync: saveSettingMutate } = useSaveSettings();

  // Provider state.
  const provider = {
    accounts,
    isAccountsLoading,
    saveSettingMutate,
  };
  // Detarmines whether if any query is loading.
  const isLoading = isSettingsLoading || isAccountsLoading;

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_ACCOUNTANT,
      )}
    >
      <AccountantFormCard>
        {isLoading ? <PreferencesPageLoader /> : <AccountantFormContext.Provider value={provider} {...props} />}
      </AccountantFormCard>
    </div>
  );
}

const useAccountantFormContext = () => React.useContext(AccountantFormContext);

export { AccountantFormProvider, useAccountantFormContext };

const AccountantFormCard = styled(Card)`
  padding: 25px;
`;
