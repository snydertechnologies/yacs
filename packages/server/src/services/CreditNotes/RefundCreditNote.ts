import { IAccount, IRefundCreditNote } from '@bigcapital/libs-backend';
import { ServiceError } from '@bigcapital/server/exceptions';
import HasTenancyService from '@bigcapital/server/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import BaseCreditNotes from './CreditNotes';
import { ERRORS } from './constants';

@Service()
export default class RefundCreditNote extends BaseCreditNotes {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieve the credit note graph.
   * @param {number} tenantId
   * @param {number} refundCreditId
   * @returns {Promise<IRefundCreditNote>}
   */
  public getCreditNoteRefundOrThrowError = async (
    tenantId: number,
    refundCreditId: number,
  ): Promise<IRefundCreditNote> => {
    const { RefundCreditNote } = this.tenancy.models(tenantId);

    const refundCreditNote = await RefundCreditNote.query().findById(refundCreditId);
    if (!refundCreditNote) {
      throw new ServiceError(ERRORS.REFUND_CREDIT_NOTE_NOT_FOUND);
    }
    return refundCreditNote;
  };

  /**
   * Validate the refund account type.
   * @param {IAccount} account
   */
  public validateRefundWithdrawwalAccountType = (account: IAccount): void => {
    const supportedTypes = ['bank', 'cash', 'fixed-asset'];

    if (supportedTypes.indexOf(account.accountType) === -1) {
      throw new ServiceError(ERRORS.ACCOUNT_INVALID_TYPE);
    }
  };
}
