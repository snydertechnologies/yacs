// @ts-nocheck
import General from '@bigcapital/webapp/containers/Preferences/General/General';
import Users from '../containers/Preferences/Users/Users';
import Roles from '../containers/Preferences/Users/Roles/RolesForm/RolesFormPage';
import Accountant from '@bigcapital/webapp/containers/Preferences/Accountant/Accountant';
import Currencies from '@bigcapital/webapp/containers/Preferences/Currencies/Currencies';
import Item from '@bigcapital/webapp/containers/Preferences/Item';
import SMSIntegration from '../containers/Preferences/SMSIntegration';
import DefaultRoute from '../containers/Preferences/DefaultRoute';
import Warehouses from '../containers/Preferences/Warehouses';
import Branches from '../containers/Preferences/Branches';
import Invoices from '../containers/Preferences/Invoices/PreferencesInvoices';
import { PreferencesCreditNotes } from '../containers/Preferences/CreditNotes/PreferencesCreditNotes';
import { PreferencesEstimates } from '@bigcapital/webapp/containers/Preferences/Estimates/PreferencesEstimates';
import { PreferencesReceipts } from '@bigcapital/webapp/containers/Preferences/Receipts/PreferencesReceipts';

const BASE_URL = '/preferences';

export default [
  {
    path: `${BASE_URL}/general`,
    component: General,
    exact: true,
  },
  {
    path: `${BASE_URL}/users`,
    component: Users,
    exact: true,
  },
  {
    path: `${BASE_URL}/invoices`,
    component: Invoices,
    exact: true,
  },
  {
    path: `${BASE_URL}/credit-notes`,
    component: PreferencesCreditNotes,
    exact: true,
  },
  {
    path: `${BASE_URL}/estimates`,
    component: PreferencesEstimates,
    exact: true,
  },
  {
    path: `${BASE_URL}/receipts`,
    component: PreferencesReceipts,
    exact: true,
  },
  {
    path: `${BASE_URL}/roles`,
    component: Roles,
    exact: true,
  },
  {
    path: `${BASE_URL}/roles/:id`,
    component: Roles,
    exact: true,
  },
  {
    path: `${BASE_URL}/currencies`,
    component: Currencies,
    exact: true,
  },
  {
    path: `${BASE_URL}/warehouses`,
    component: Warehouses,
    exact: true,
  },
  {
    path: `${BASE_URL}/branches`,
    component: Branches,
    exact: true,
  },
  {
    path: `${BASE_URL}/accountant`,
    component: Accountant,
    exact: true,
  },
  {
    path: `${BASE_URL}/items`,
    component: Item,
    exact: true,
  },
  {
    path: `${BASE_URL}/sms-message`,
    component: SMSIntegration,
    exact: true,
  },
  {
    path: `${BASE_URL}/`,
    component: DefaultRoute,
    exact: true,
  },
];
