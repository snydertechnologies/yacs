import { AbilitySubject, ICashFlowStatementDOO, ReportsAction } from '@bigcapital/libs-backend';
import CheckPolicies from '@bigcapital/server/api/middleware/CheckPolicies';
import { ServiceError } from '@bigcapital/server/exceptions';
import CashFlowTable from '@bigcapital/server/services/FinancialStatements/CashFlow/CashFlowTable';
import CashflowAccountTransactionsService from '@bigcapital/server/services/FinancialStatements/CashflowAccountTransactions/CashflowAccountTransactionsService';
import HasTenancyService from '@bigcapital/server/services/Tenancy/TenancyService';
import { NextFunction, Request, Response, Router, ValidationChain } from 'express';
import { query } from 'express-validator';
import { Inject, Service } from 'typedi';
import BaseFinancialReportController from '../BaseFinancialReportController';

@Service()
export default class CashFlowAccountTransactionsController extends BaseFinancialReportController {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  cashflowAccountTransactions: CashflowAccountTransactionsService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(ReportsAction.READ_CASHFLOW_ACCOUNT_TRANSACTION, AbilitySubject.Report),
      this.validationSchema,
      this.validationResult,
      this.asyncMiddleware(this.cashFlow),
      this.catchServiceErrors,
    );
    return router;
  }

  /**
   * Cashflow account transactions validation schecma.
   * @returns {ValidationChain[]}
   */
  get validationSchema(): ValidationChain[] {
    return [
      query('account_id').exists().isInt().toInt(),

      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
    ];
  }

  /**
   * Retrieve the cashflow account transactions statment to json response.
   * @param {ICashFlowStatement} cashFlow -
   */
  private transformJsonResponse(casahflowAccountTransactions) {
    const { transactions, pagination } = casahflowAccountTransactions;

    return {
      transactions: this.transfromToResponse(transactions),
      pagination: this.transfromToResponse(pagination),
    };
  }

  /**
   * Transformes the report statement to table rows.
   * @param {ITransactionsByVendorsStatement} statement -
   */
  private transformToTableRows(cashFlowDOO: ICashFlowStatementDOO, tenantId: number) {
    const i18n = this.tenancy.i18n(tenantId);
    const cashFlowTable = new CashFlowTable(cashFlowDOO, i18n);

    return {
      table: {
        data: cashFlowTable.tableRows(),
        columns: cashFlowTable.tableColumns(),
      },
      query: this.transfromToResponse(cashFlowDOO.query),
      meta: this.transfromToResponse(cashFlowDOO.meta),
    };
  }

  /**
   * Retrieve the cash flow statment.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Response}
   */
  private cashFlow = async (req: Request, res: Response, next: NextFunction) => {
    const { tenantId } = req;
    const query = this.matchedQueryData(req);

    try {
      const cashFlowAccountTransactions = await this.cashflowAccountTransactions.cashflowAccountTransactions(
        tenantId,
        query,
      );

      const accept = this.accepts(req);
      const acceptType = accept.types(['json', 'application/json+table']);

      switch (acceptType) {
        // case 'application/json+table':
        //   return res
        //     .status(200)
        //     .send(this.transformToTableRows(cashFlow, tenantId));
        case 'json':
        default:
          return res.status(200).send(this.transformJsonResponse(cashFlowAccountTransactions));
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Catches the service errors.
   * @param {Error} error - Error.
   * @param {Request} req - Request.
   * @param {Response} res - Response.
   * @param {NextFunction} next -
   */
  private catchServiceErrors(error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'ACCOUNT_ID_HAS_INVALID_TYPE') {
        return res.boom.badRequest('The given account id should be cash, bank or credit card type.', {
          errors: [{ type: 'ACCOUNT_ID_HAS_INVALID_TYPE', code: 200 }],
        });
      }
      if (error.errorType === 'account_not_found') {
        return res.boom.notFound('The given account not found.', {
          errors: [{ type: 'ACCOUNT.NOT.FOUND', code: 100 }],
        });
      }
    }
    next(error);
  }
}
