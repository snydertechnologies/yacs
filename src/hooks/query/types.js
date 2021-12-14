const ACCOUNTS = {
  ACCOUNT: 'ACCOUNT',
  ACCOUNT_TRANSACTION: 'ACCOUNT_TRANSACTION',
  ACCOUNTS: 'ACCOUNTS',
  ACCOUNTS_TYPES: 'ACCOUNTS_TYPES',
};

const FINANCIAL_REPORTS = {
  FINANCIAL_REPORT: 'FINANCIAL-REPORT',
  BALANCE_SHEET: 'BALANCE-SHEET',
  TRIAL_BALANCE_SHEET: 'TRIAL-BALANCE-SHEET',
  PROFIT_LOSS_SHEET: 'PROFIT-LOSS-SHEET',
  GENERAL_LEDGER: 'GENERAL-LEDGER',
  JOURNAL: 'JOURNAL',
  AR_AGING_SUMMARY: 'AR-AGING-SUMMARY',
  AP_AGING_SUMMARY: 'AP-AGING-SUMMARY',
  VENDORS_TRANSACTIONS: 'VENDORS_TRANSACTIONS',
  CUSTOMERS_TRANSACTIONS: 'CUSTOMERS_TRANSACTIONS',
  VENDORS_BALANCE_SUMMARY: 'VENDORS_BALANCE_SUMMARY',
  CUSTOMERS_BALANCE_SUMMARY: 'CUSTOMERS_BALANCE_SUMMARY',
  SALES_BY_ITEMS: 'SALES_BY_ITEMS',
  PURCHASES_BY_ITEMS: 'PURCHASES_BY_ITEMS',
  INVENTORY_VALUATION: 'INVENTORY_VALUATION',
  CASH_FLOW_STATEMENT: 'CASH_FLOW_STATEMENT',
  INVENTORY_ITEM_DETAILS: 'INVENTORY_ITEM_DETAILS',
  TRANSACTIONS_BY_REFERENCE: 'TRANSACTIONS_BY_REFERENCE',
};

const BILLS = {
  BILLS: 'BILLS',
  BILL: 'BILL',
  BILLS_DUE: 'BILLS_DUE',
  BILLS_PAYMENT_TRANSACTIONS: 'BILLS_PAYMENT_TRANSACTIONS',
};

const VENDORS = {
  VENDORS: 'VENDORS',
  VENDOR: 'VENDOR',
};

const CUSTOMERS = {
  CUSTOMERS: 'CUSTOMERS',
  CUSTOMER: 'CUSTOMER',
};

const ITEMS = {
  ITEMS: 'ITEMS',
  ITEM: 'ITEM',
  ITEMS_CATEGORIES: 'ITEMS_CATEGORIES',
  ITEM_ASSOCIATED_WITH_INVOICES: 'ITEM_ASSOCIATED_WITH_INVOICES',
  ITEM_ASSOCIATED_WITH_ESTIMATES: 'ITEM_ASSOCIATED_WITH_ESTIMATES',
  ITEM_ASSOCIATED_WITH_RECEIVES: 'ITEM_ASSOCIATED_WITH_RECEIPTS',
  ITEM_ASSOCIATED_WITH_BILSS: 'ITEMS_ASSOCIATED_WITH_BILLS',
};

const SALE_ESTIMATES = {
  SALE_ESTIMATES: 'SALE_ESTIMATES',
  SALE_ESTIMATE: 'SALE_ESTIMATE',
  SALE_ESTIMATE_SMS_DETAIL: 'SALE_ESTIMATE_SMS_DETAIL',
  NOTIFY_SALE_ESTIMATE_BY_SMS: 'NOTIFY_SALE_ESTIMATE_BY_SMS',
};

const SALE_RECEIPTS = {
  SALE_RECEIPTS: 'SALE_RECEIPTS',
  SALE_RECEIPT: 'SALE_RECEIPT',
  SALE_RECEIPT_SMS_DETAIL: 'SALE_RECEIPT_SMS_DETAIL',
  NOTIFY_SALE_RECEIPT_BY_SMS: 'NOTIFY_SALE_RECEIPT_BY_SMS',
};

const INVENTORY_ADJUSTMENTS = {
  INVENTORY_ADJUSTMENTS: 'INVENTORY_ADJUSTMENTS',
  INVENTORY_ADJUSTMENT: 'INVENTORY_ADJUSTMENT',
};

const CURRENCIES = {
  CURRENCIES: 'CURRENCIES',
};

const PAYMENT_MADES = {
  PAYMENT_MADES: 'PAYMENT_MADES',
  PAYMENT_MADE: 'PAYMENT_MADE',
  PAYMENT_MADE_NEW_ENTRIES: 'PAYMENT_MADE_NEW_ENTRIES',
  PAYMENT_MADE_EDIT_PAGE: 'PAYMENT_MADE_EDIT_PAGE',
};

const PAYMENT_RECEIVES = {
  PAYMENT_RECEIVES: 'PAYMENT_RECEIVES',
  PAYMENT_RECEIVE: 'PAYMENT_RECEIVE',
  PAYMENT_RECEIVE_NEW_ENTRIES: 'PAYMENT_RECEIVE_NEW_ENTRIES',
  PAYMENT_RECEIVE_EDIT_PAGE: 'PAYMENT_RECEIVE_EDIT_PAGE',
  PAYMENT_RECEIVE_SMS_DETAIL: 'PAYMENT_RECEIVE_SMS_DETAIL',
  NOTIFY_PAYMENT_RECEIVE_BY_SMS: 'NOTIFY_PAYMENT_RECEIVE_BY_SMS',
};

const SALE_INVOICES = {
  SALE_INVOICES: 'SALE_INVOICES',
  SALE_INVOICE: 'SALE_INVOICE',
  SALE_INVOICES_DUE: 'SALE_INVOICES_DUE',
  SALE_INVOICE_SMS_DETAIL: 'SALE_INVOICE_SMS_DETAIL',
  NOTIFY_SALE_INVOICE_BY_SMS: 'NOTIFY_SALE_INVOICE_BY_SMS',
  BAD_DEBT: 'BAD_DEBT',
  CANCEL_BAD_DEBT: 'CANCEL_BAD_DEBT',
  SALE_INVOICE_PAYMENT_TRANSACTIONS: 'SALE_INVOICE_PAYMENT_TRANSACTIONS',
};

const USERS = {
  USERS: 'USERS',
  USER: 'USER',
};

const ROLES = {
  ROLE: 'ROLE',
  ROLES: 'ROLES',
  ROLES_PERMISSIONS_SCHEMA: 'ROLES_PERMISSIONS_SCHEMA',
};

const CREDIT_NOTES = {
  CREDIT_NOTE: 'CREDIT_NOTE',
  CREDIT_NOTES: 'CREDIT_NOTES',
  REFUND_CREDIT_NOTE: 'REFUND_CREDIT_NOTE',
  RECONCILE_CREDIT_NOTE: 'RECONCILE_CREDIT_NOTE',
  RECONCILE_CREDIT_NOTES: 'RECONCILE_CREDIT_NOTES',
};

const VENDOR_CREDIT_NOTES = {
  VENDOR_CREDITS: 'VENDOR_CREDITS',
  VENDOR_CREDIT: 'VENDOR_CREDIT',
  REFUND_VENDOR_CREDIT: 'REFUND_VENDOR_CREDIT',
  RECONCILE_VENDOR_CREDIT: 'RECONCILE_VENDOR_CREDIT',
  RECONCILE_VENDOR_CREDITS: 'RECONCILE_VENDOR_CREDITS',
};

const SETTING = {
  SETTING: 'SETTING',
  SETTING_INVOICES: 'SETTING_INVOICES',
  SETTING_ESTIMATES: 'SETTING_ESTIMATES',
  SETTING_RECEIPTS: 'SETTING_RECEIPTS',
  SETTING_PAYMENT_RECEIVES: 'SETTING_PAYMENT_RECEIVES',
  SETTING_MANUAL_JOURNALS: 'SETTING_MANUAL_JOURNALS',
  SETTING_ITEMS: 'SETTING_ITEMS',
  SETTING_CASHFLOW: 'SETTING_CASHFLOW',
  SETTING_SMS_NOTIFICATION: 'SETTING_SMS_NOTIFICATION',
  SETTING_SMS_NOTIFICATIONS: 'SETTING_SMS_NOTIFICATIONS',
  SETTING_EDIT_SMS_NOTIFICATION: 'SETTING_EDIT_SMS_NOTIFICATION',
  SETTING_CREDIT_NOTES: 'SETTING_CREDIT_NOTES',
  SETTING_VENDOR_CREDITS: 'SETTING_VENDOR_CREDITS',
};

const ORGANIZATIONS = {
  ORGANIZATIONS: 'ORGANIZATIONS',
  ORGANIZATION_CURRENT: 'ORGANIZATION_CURRENT',
};

const SUBSCRIPTIONS = {
  SUBSCRIPTIONS: 'SUBSCRIPTIONS',
};

const EXPENSES = {
  EXPENSES: 'EXPENSES',
  EXPENSE: 'EXPENSE',
};

const MANUAL_JOURNALS = {
  MANUAL_JOURNALS: 'MANUAL_JOURNALS',
  MANUAL_JOURNAL: 'MANUAL_JOURNAL',
};

const LANDED_COSTS = {
  LANDED_COST: 'LANDED_COST',
  LANDED_COSTS: 'LANDED_COSTS',
  LANDED_COST_TRANSACTION: 'LANDED_COST_TRANSACTION',
};

const CONTACTS = {
  CONTACTS: 'CONTACTS',
  CONTACT: 'CONTACT',
};

const CASH_FLOW_ACCOUNTS = {
  CASH_FLOW_ACCOUNTS: 'CASH_FLOW_ACCOUNTS',
  CASH_FLOW_TRANSACTIONS: 'CASH_FLOW_TRANSACTIONS',
  CASH_FLOW_TRANSACTION: 'CASH_FLOW_TRANSACTION',
  CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY:
    'CASHFLOW_ACCOUNT_TRANSACTIONS_INFINITY',
};

const TARNSACTIONS_LOCKING = {
  TRANSACTION_LOCKING: 'TRANSACTION_LOCKING',
  TRANSACTIONS_LOCKING: 'TRANSACTIONS_LOCKING',
};

export default {
  ...ACCOUNTS,
  ...BILLS,
  ...VENDORS,
  ...CUSTOMERS,
  ...FINANCIAL_REPORTS,
  ...ITEMS,
  ...SALE_ESTIMATES,
  ...INVENTORY_ADJUSTMENTS,
  ...CURRENCIES,
  ...SALE_RECEIPTS,
  ...PAYMENT_MADES,
  ...PAYMENT_RECEIVES,
  ...SALE_INVOICES,
  ...USERS,
  ...SETTING,
  ...ORGANIZATIONS,
  ...SUBSCRIPTIONS,
  ...EXPENSES,
  ...MANUAL_JOURNALS,
  ...LANDED_COSTS,
  ...CONTACTS,
  ...CASH_FLOW_ACCOUNTS,
  ...ROLES,
  ...CREDIT_NOTES,
  ...VENDOR_CREDIT_NOTES,
  ...TARNSACTIONS_LOCKING,
};
