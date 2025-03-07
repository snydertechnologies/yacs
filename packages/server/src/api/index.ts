import { Router } from 'express';
import { Container } from 'typedi';

import AttachCurrentTenantUser from '@bigcapital/server/api/middleware/AttachCurrentTenantUser';
import EnsureTenantIsInitialized from '@bigcapital/server/api/middleware/EnsureTenantIsInitialized';
import EnsureTenantIsSeeded from '@bigcapital/server/api/middleware/EnsureTenantIsSeeded';
import I18nAuthenticatedMiddlware from '@bigcapital/server/api/middleware/I18nAuthenticatedMiddlware';
import I18nMiddleware from '@bigcapital/server/api/middleware/I18nMiddleware';
import SettingsMiddleware from '@bigcapital/server/api/middleware/SettingsMiddleware';
import SubscriptionMiddleware from '@bigcapital/server/api/middleware/SubscriptionMiddleware';
import TenancyMiddleware from '@bigcapital/server/api/middleware/TenancyMiddleware';
import JWTAuth from '@bigcapital/server/api/middleware/jwtAuth';

import Account from '@bigcapital/server/api/controllers/Account';
import AccountTypes from '@bigcapital/server/api/controllers/AccountTypes';
import Accounts from '@bigcapital/server/api/controllers/Accounts';
import Authentication from '@bigcapital/server/api/controllers/Authentication';
import Contacts from '@bigcapital/server/api/controllers/Contacts/Contacts';
import Customers from '@bigcapital/server/api/controllers/Contacts/Customers';
import Vendors from '@bigcapital/server/api/controllers/Contacts/Vendors';
import Currencies from '@bigcapital/server/api/controllers/Currencies';
import ExchangeRates from '@bigcapital/server/api/controllers/ExchangeRates';
import Expenses from '@bigcapital/server/api/controllers/Expenses';
import FinancialStatements from '@bigcapital/server/api/controllers/FinancialStatements';
import InventoryAdjustments from '@bigcapital/server/api/controllers/Inventory/InventoryAdjustments';
import InviteUsers from '@bigcapital/server/api/controllers/InviteUsers';
import ItemCategories from '@bigcapital/server/api/controllers/ItemCategories';
import Items from '@bigcapital/server/api/controllers/Items';
import ManualJournals from '@bigcapital/server/api/controllers/ManualJournals';
import Media from '@bigcapital/server/api/controllers/Media';
import Miscellaneous from '@bigcapital/server/api/controllers/Miscellaneous';
import Organization from '@bigcapital/server/api/controllers/Organization';
import OrganizationDashboard from '@bigcapital/server/api/controllers/OrganizationDashboard';
import Ping from '@bigcapital/server/api/controllers/Ping';
import Purchases from '@bigcapital/server/api/controllers/Purchases';
import Sales from '@bigcapital/server/api/controllers/Sales';
import Settings from '@bigcapital/server/api/controllers/Settings';
import { SubscriptionController } from '@bigcapital/server/api/controllers/Subscription';
import Users from '@bigcapital/server/api/controllers/Users';
import Views from '@bigcapital/server/api/controllers/Views';
import { BranchIntegrationErrorsMiddleware } from '@bigcapital/server/services/Branches/BranchIntegrationErrorsMiddleware';
import { BankingController } from './controllers/Banking/BankingController';
import { BranchesController } from './controllers/Branches';
import CashflowController from './controllers/Cashflow/CashflowController';
import DashboardController from './controllers/Dashboard';
import { ExportController } from './controllers/Export/ExportController';
import { ImportController } from './controllers/Import/ImportController';
import { InventoryItemsCostController } from './controllers/Inventory/InventortyItemsCosts';
import Jobs from './controllers/Jobs';
import { ProjectsController } from './controllers/Projects/Projects';
import { ProjectTasksController } from './controllers/Projects/Tasks';
import { ProjectTimesController } from './controllers/Projects/Times';
import Resources from './controllers/Resources';
import RolesController from './controllers/Roles';
import { TaxRatesController } from './controllers/TaxRates/TaxRates';
import TransactionsLocking from './controllers/TransactionsLocking';
import { WarehousesController } from './controllers/Warehouses';
import { WarehousesTransfers } from './controllers/Warehouses/WarehouseTransfers';
import { WarehousesItemController } from './controllers/Warehouses/WarehousesItem';
import { Webhooks } from './controllers/Webhooks/Webhooks';
import asyncRenderMiddleware from './middleware/AsyncRenderMiddleware';
import AuthorizationMiddleware from './middleware/AuthorizationMiddleware';

export default () => {
  const app = Router();

  // - Global routes.
  // ---------------------------
  app.use(asyncRenderMiddleware);
  app.use(I18nMiddleware);

  app.use('/auth', Container.get(Authentication).router());
  app.use('/invite', Container.get(InviteUsers).nonAuthRouter());
  app.use('/subscription', Container.get(SubscriptionController).router());
  app.use('/organization', Container.get(Organization).router());
  app.use('/ping', Container.get(Ping).router());
  app.use('/jobs', Container.get(Jobs).router());
  app.use('/account', Container.get(Account).router());
  app.use('/webhooks', Container.get(Webhooks).router());

  // - Dashboard routes.
  // ---------------------------
  const dashboard = Router();

  dashboard.use(JWTAuth);
  dashboard.use(AttachCurrentTenantUser);
  dashboard.use(TenancyMiddleware);
  dashboard.use(SubscriptionMiddleware('main'));
  dashboard.use(EnsureTenantIsInitialized);
  dashboard.use(SettingsMiddleware);
  dashboard.use(I18nAuthenticatedMiddlware);
  dashboard.use(EnsureTenantIsSeeded);
  dashboard.use(AuthorizationMiddleware);

  dashboard.use('/organization', Container.get(OrganizationDashboard).router());
  dashboard.use('/users', Container.get(Users).router());
  dashboard.use('/invite', Container.get(InviteUsers).authRouter());
  dashboard.use('/currencies', Container.get(Currencies).router());
  dashboard.use('/settings', Container.get(Settings).router());
  dashboard.use('/accounts', Container.get(Accounts).router());
  dashboard.use('/account_types', Container.get(AccountTypes).router());
  dashboard.use('/manual-journals', Container.get(ManualJournals).router());
  dashboard.use('/views', Container.get(Views).router());
  dashboard.use('/items', Container.get(Items).router());
  dashboard.use('/item_categories', Container.get(ItemCategories).router());
  dashboard.use('/expenses', Container.get(Expenses).router());
  dashboard.use('/financial_statements', Container.get(FinancialStatements).router());
  dashboard.use('/contacts', Container.get(Contacts).router());
  dashboard.use('/customers', Container.get(Customers).router());
  dashboard.use('/vendors', Container.get(Vendors).router());
  dashboard.use('/sales', Container.get(Sales).router());
  dashboard.use('/purchases', Container.get(Purchases).router());
  dashboard.use('/resources', Container.get(Resources).router());
  dashboard.use('/exchange_rates', Container.get(ExchangeRates).router());
  dashboard.use('/media', Container.get(Media).router());
  dashboard.use('/inventory_adjustments', Container.get(InventoryAdjustments).router());
  dashboard.use('/inventory', Container.get(InventoryItemsCostController).router());
  dashboard.use('/cashflow', Container.get(CashflowController).router());
  dashboard.use('/banking', Container.get(BankingController).router());
  dashboard.use('/roles', Container.get(RolesController).router());
  dashboard.use('/transactions-locking', Container.get(TransactionsLocking).router());
  dashboard.use('/branches', Container.get(BranchesController).router());
  dashboard.use('/warehouses/transfers', Container.get(WarehousesTransfers).router());
  dashboard.use('/warehouses', Container.get(WarehousesController).router());
  dashboard.use('/projects', Container.get(ProjectsController).router());
  dashboard.use('/tax-rates', Container.get(TaxRatesController).router());
  dashboard.use('/import', Container.get(ImportController).router());
  dashboard.use('/export', Container.get(ExportController).router());

  dashboard.use('/', Container.get(ProjectTasksController).router());
  dashboard.use('/', Container.get(ProjectTimesController).router());
  dashboard.use('/', Container.get(WarehousesItemController).router());

  dashboard.use('/dashboard', Container.get(DashboardController).router());
  dashboard.use('/', Container.get(Miscellaneous).router());

  app.use('/', dashboard);

  app.use(BranchIntegrationErrorsMiddleware);

  return app;
};
