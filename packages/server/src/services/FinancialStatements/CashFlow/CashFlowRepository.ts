import { IAccount, IAccountTransaction, ICashFlowStatementQuery } from '@bigcapital/libs-backend';
import HasTenancyService from '@bigcapital/server/services/Tenancy/TenancyService';
import { Knex } from 'knex';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Inject, Service } from 'typedi';

@Service()
export default class CashFlowRepository {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieve the group type from periods type.
   * @param {string} displayType
   * @returns {string}
   */
  protected getGroupTypeFromPeriodsType(displayType: string) {
    const displayTypes = {
      year: 'year',
      day: 'day',
      month: 'month',
      quarter: 'month',
      week: 'day',
    };
    return displayTypes[displayType] || 'month';
  }

  /**
   * Retrieve the cashflow accounts.
   * @returns {Promise<IAccount[]>}
   */
  public async cashFlowAccounts(tenantId: number): Promise<IAccount[]> {
    const { Account } = this.tenancy.models(tenantId);

    const accounts = await Account.query();

    return accounts;
  }

  /**
   * Retrieve total of csah at beginning transactions.
   * @param {number} tenantId -
   * @param {ICashFlowStatementQuery} filter -
   * @return {Promise<IAccountTransaction[]>}
   */
  public cashAtBeginningTotalTransactions(
    tenantId: number,
    filter: ICashFlowStatementQuery,
  ): Promise<IAccountTransaction[]> {
    const { AccountTransaction } = this.tenancy.models(tenantId);
    const cashBeginningPeriod = moment(filter.fromDate).subtract(1, 'day').toDate();

    return AccountTransaction.query().onBuild((query) => {
      query.modify('creditDebitSummation');

      query.select('accountId');
      query.groupBy('accountId');

      query.withGraphFetched('account');
      query.modify('filterDateRange', null, cashBeginningPeriod);

      this.commonFilterBranchesQuery(filter, query);
    });
  }

  /**
   * Retrieve accounts transactions.
   * @param {number} tenantId -
   * @param {ICashFlowStatementQuery} filter
   * @return {Promise<IAccountTransaction>}
   */
  public getAccountsTransactions(tenantId: number, filter: ICashFlowStatementQuery): Promise<IAccountTransaction[]> {
    const { AccountTransaction } = this.tenancy.models(tenantId);
    const groupByDateType = this.getGroupTypeFromPeriodsType(filter.displayColumnsBy);

    return AccountTransaction.query().onBuild((query) => {
      query.modify('creditDebitSummation');
      query.modify('groupByDateFormat', groupByDateType);

      query.select('accountId');

      query.groupBy('accountId');
      query.withGraphFetched('account');

      query.modify('filterDateRange', filter.fromDate, filter.toDate);

      this.commonFilterBranchesQuery(filter, query);
    });
  }

  /**
   * Retrieve the net income tranasctions.
   * @param {number} tenantId -
   * @param {ICashFlowStatementQuery} query -
   * @return {Promise<IAccountTransaction[]>}
   */
  public getNetIncomeTransactions(tenantId: number, filter: ICashFlowStatementQuery): Promise<IAccountTransaction[]> {
    const { AccountTransaction } = this.tenancy.models(tenantId);
    const groupByDateType = this.getGroupTypeFromPeriodsType(filter.displayColumnsBy);

    return AccountTransaction.query().onBuild((query) => {
      query.modify('creditDebitSummation');
      query.modify('groupByDateFormat', groupByDateType);

      query.select('accountId');
      query.groupBy('accountId');

      query.withGraphFetched('account');
      query.modify('filterDateRange', filter.fromDate, filter.toDate);

      this.commonFilterBranchesQuery(filter, query);
    });
  }

  /**
   * Retrieve peridos of cash at beginning transactions.
   * @param {number} tenantId -
   * @param {ICashFlowStatementQuery} filter -
   * @return {Promise<IAccountTransaction[]>}
   */
  public cashAtBeginningPeriodTransactions(
    tenantId: number,
    filter: ICashFlowStatementQuery,
  ): Promise<IAccountTransaction[]> {
    const { AccountTransaction } = this.tenancy.models(tenantId);
    const groupByDateType = this.getGroupTypeFromPeriodsType(filter.displayColumnsBy);

    return AccountTransaction.query().onBuild((query) => {
      query.modify('creditDebitSummation');
      query.modify('groupByDateFormat', groupByDateType);

      query.select('accountId');
      query.groupBy('accountId');

      query.withGraphFetched('account');
      query.modify('filterDateRange', filter.fromDate, filter.toDate);

      this.commonFilterBranchesQuery(filter, query);
    });
  }

  /**
   * Common branches filter query.
   * @param {Knex.QueryBuilder} query
   */
  private commonFilterBranchesQuery = (query: ICashFlowStatementQuery, knexQuery: Knex.QueryBuilder) => {
    if (!isEmpty(query.branchesIds)) {
      knexQuery.modify('filterByBranches', query.branchesIds);
    }
  };
}
