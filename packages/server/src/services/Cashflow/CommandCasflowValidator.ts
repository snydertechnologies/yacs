import { IAccount, IUncategorizedCashflowTransaction } from '@bigcapital/libs-backend';
import { ServiceError } from '@bigcapital/server/exceptions';
import CashflowTransaction from '@bigcapital/server/models/CashflowTransaction';
import { camelCase, includes, upperFirst } from 'lodash';
import { Service } from 'typedi';
import { CASHFLOW_DIRECTION, CASHFLOW_TRANSACTION_TYPE, ERRORS } from './constants';
import { getCashflowTransactionType } from './utils';

@Service()
export class CommandCashflowValidator {
  /**
   * Validates the lines accounts type should be cash or bank account.
   * @param {IAccount} accounts -
   */
  public validateCreditAccountWithCashflowType = (
    creditAccount: IAccount,
    cashflowTransactionType: CASHFLOW_TRANSACTION_TYPE,
  ): void => {
    const transactionTypeMeta = getCashflowTransactionType(cashflowTransactionType);
    const noneCashflowAccount = !includes(transactionTypeMeta.creditType, creditAccount.accountType);
    if (noneCashflowAccount) {
      throw new ServiceError(ERRORS.CREDIT_ACCOUNTS_HAS_INVALID_TYPE);
    }
  };

  /**
   * Validates the cashflow transaction type.
   * @param   {string} transactionType
   * @returns {string}
   */
  public validateCashflowTransactionType = (transactionType: string) => {
    const transformedType = upperFirst(camelCase(transactionType)) as CASHFLOW_TRANSACTION_TYPE;

    // Retrieve the given transaction type meta.
    const transactionTypeMeta = getCashflowTransactionType(transformedType);

    // Throw service error in case not the found the given transaction type.
    if (!transactionTypeMeta) {
      throw new ServiceError(ERRORS.CASHFLOW_TRANSACTION_TYPE_INVALID);
    }
    return transformedType;
  };

  /**
   * Validate the given transaction should be categorized.
   * @param {CashflowTransaction} cashflowTransaction
   */
  public validateTransactionShouldCategorized(cashflowTransaction: CashflowTransaction) {
    if (!cashflowTransaction.uncategorize) {
      throw new ServiceError(ERRORS.TRANSACTION_ALREADY_CATEGORIZED);
    }
  }

  /**
   * Validate the given transcation shouldn't be categorized.
   * @param {CashflowTransaction} cashflowTransaction
   */
  public validateTransactionShouldNotCategorized(cashflowTransaction: CashflowTransaction) {
    if (cashflowTransaction.uncategorize) {
      throw new ServiceError(ERRORS.TRANSACTION_ALREADY_CATEGORIZED);
    }
  }

  /**
   *
   * @param {uncategorizeTransaction}
   * @param {string} transactionType
   * @throws {ServiceError(ERRORS.UNCATEGORIZED_TRANSACTION_TYPE_INVALID)}
   */
  public validateUncategorizeTransactionType(
    uncategorizeTransaction: IUncategorizedCashflowTransaction,
    transactionType: string,
  ) {
    const type = getCashflowTransactionType(upperFirst(camelCase(transactionType)) as CASHFLOW_TRANSACTION_TYPE);
    if (
      (type.direction === CASHFLOW_DIRECTION.IN && uncategorizeTransaction.isDepositTransaction) ||
      (type.direction === CASHFLOW_DIRECTION.OUT && uncategorizeTransaction.isWithdrawalTransaction)
    ) {
      return;
    }
    throw new ServiceError(ERRORS.UNCATEGORIZED_TRANSACTION_TYPE_INVALID);
  }
}
