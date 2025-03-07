import {
  ICreditNote,
  ICreditNoteAppliedToInvoice,
  ICreditNoteAppliedToInvoiceModel,
  ISaleInvoice,
} from '@bigcapital/libs-backend';
import { IApplyCreditToInvoicesCreatedPayload, IApplyCreditToInvoicesDTO } from '@bigcapital/libs-backend';
import { ServiceError } from '@bigcapital/server/exceptions';
import { EventPublisher } from '@bigcapital/server/lib/EventPublisher/EventPublisher';
import UnitOfWork from '@bigcapital/server/services/UnitOfWork';
import events from '@bigcapital/server/subscribers/events';
import { Knex } from 'knex';
import { sumBy } from 'lodash';
import { Inject, Service } from 'typedi';
import { PaymentReceiveValidators } from '../Sales/PaymentReceives/PaymentReceiveValidators';
import HasTenancyService from '../Tenancy/TenancyService';
import BaseCreditNotes from './CreditNotes';
import { ERRORS } from './constants';

@Service()
export default class CreditNoteApplyToInvoices extends BaseCreditNotes {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private paymentReceiveValidators: PaymentReceiveValidators;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Apply credit note to the given invoices.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @param {IApplyCreditToInvoicesDTO} applyCreditToInvoicesDTO
   */
  public applyCreditNoteToInvoices = async (
    tenantId: number,
    creditNoteId: number,
    applyCreditToInvoicesDTO: IApplyCreditToInvoicesDTO,
  ): Promise<ICreditNoteAppliedToInvoice[]> => {
    const { CreditNoteAppliedInvoice } = this.tenancy.models(tenantId);

    // Saves the credit note or throw not found service error.
    const creditNote = await this.getCreditNoteOrThrowError(tenantId, creditNoteId);
    // Retrieve the applied invoices that associated to the credit note customer.
    const appliedInvoicesEntries = await this.paymentReceiveValidators.validateInvoicesIDsExistance(
      tenantId,
      creditNote.customerId,
      applyCreditToInvoicesDTO.entries,
    );
    // Transformes apply DTO to model.
    const creditNoteAppliedModel = this.transformApplyDTOToModel(applyCreditToInvoicesDTO, creditNote);
    // Validate invoices has remaining amount to apply.
    this.validateInvoicesRemainingAmount(appliedInvoicesEntries, creditNoteAppliedModel.amount);
    // Validate the credit note remaining amount.
    this.validateCreditRemainingAmount(creditNote, creditNoteAppliedModel.amount);
    // Creates credit note apply to invoice transaction.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Saves the credit note apply to invoice graph to the storage layer.
      const creditNoteAppliedInvoices = await CreditNoteAppliedInvoice.query().insertGraph(
        creditNoteAppliedModel.entries,
      );
      // Triggers `onCreditNoteApplyToInvoiceCreated` event.
      await this.eventPublisher.emitAsync(events.creditNote.onApplyToInvoicesCreated, {
        tenantId,
        creditNote,
        creditNoteAppliedInvoices,
        trx,
      } as IApplyCreditToInvoicesCreatedPayload);
      return creditNoteAppliedInvoices;
    });
  };

  /**
   * Transformes apply DTO to model.
   * @param {IApplyCreditToInvoicesDTO} applyDTO
   * @param {ICreditNote} creditNote
   * @returns
   */
  private transformApplyDTOToModel = (
    applyDTO: IApplyCreditToInvoicesDTO,
    creditNote: ICreditNote,
  ): ICreditNoteAppliedToInvoiceModel => {
    const entries = applyDTO.entries.map((entry) => ({
      invoiceId: entry.invoiceId,
      amount: entry.amount,
      creditNoteId: creditNote.id,
    }));
    return {
      amount: sumBy(entries, 'amount'),
      entries,
    };
  };

  /**
   * Validate the invoice remaining amount.
   * @param {ISaleInvoice[]} invoices
   * @param {number} amount
   */
  private validateInvoicesRemainingAmount = (invoices: ISaleInvoice[], amount: number) => {
    const invalidInvoices = invoices.filter((invoice) => invoice.dueAmount < amount);
    if (invalidInvoices.length > 0) {
      throw new ServiceError(ERRORS.INVOICES_HAS_NO_REMAINING_AMOUNT);
    }
  };
}
