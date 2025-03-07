import { IApplyCreditToInvoicesDeletedPayload } from '@bigcapital/libs-backend';
import { ServiceError } from '@bigcapital/server/exceptions';
import { EventPublisher } from '@bigcapital/server/lib/EventPublisher/EventPublisher';
import UnitOfWork from '@bigcapital/server/services/UnitOfWork';
import events from '@bigcapital/server/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import BaseCreditNotes from './CreditNotes';
import { ERRORS } from './constants';

@Service()
export default class DeletreCreditNoteApplyToInvoices extends BaseCreditNotes {
  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Apply credit note to the given invoices.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @param {IApplyCreditToInvoicesDTO} applyCreditToInvoicesDTO
   */
  public deleteApplyCreditNoteToInvoices = async (tenantId: number, applyCreditToInvoicesId: number): Promise<void> => {
    const { CreditNoteAppliedInvoice } = this.tenancy.models(tenantId);

    const creditNoteAppliedToInvoice = await CreditNoteAppliedInvoice.query().findById(applyCreditToInvoicesId);

    if (!creditNoteAppliedToInvoice) {
      throw new ServiceError(ERRORS.CREDIT_NOTE_APPLY_TO_INVOICES_NOT_FOUND);
    }
    // Retrieve the credit note or throw not found service error.
    const creditNote = await this.getCreditNoteOrThrowError(tenantId, creditNoteAppliedToInvoice.creditNoteId);
    // Creates credit note apply to invoice transaction.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Delete credit note applied to invoices.
      await CreditNoteAppliedInvoice.query(trx).findById(applyCreditToInvoicesId).delete();

      // Triggers `onCreditNoteApplyToInvoiceDeleted` event.
      await this.eventPublisher.emitAsync(events.creditNote.onApplyToInvoicesDeleted, {
        trx,
        creditNote,
        creditNoteAppliedToInvoice,
        tenantId,
      } as IApplyCreditToInvoicesDeletedPayload);
    });
  };
}
