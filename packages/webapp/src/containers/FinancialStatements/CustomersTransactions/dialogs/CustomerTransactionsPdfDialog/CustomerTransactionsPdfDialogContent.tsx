// @ts-nocheck
import { DialogContent, PdfDocumentPreview, FormattedMessage as T } from '@bigcapital/webapp/components';
import { useCustomersTransactionsPdfExport } from '@bigcapital/webapp/hooks/query';
import { AnchorButton } from '@blueprintjs/core';
import { useCustomersTransactionsContext } from '../../CustomersTransactionsProvider';

export default function CashflowSheetPdfDialogContent() {
  const { httpQuery } = useCustomersTransactionsContext();
  const { isLoading, pdfUrl } = useCustomersTransactionsPdfExport(httpQuery);

  return (
    <DialogContent>
      <div className="dialog__header-actions">
        <AnchorButton href={pdfUrl} target={'__blank'} minimal={true} outlined={true}>
          <T id={'pdf_preview.preview.button'} />
        </AnchorButton>

        <AnchorButton href={pdfUrl} download={'customer-transactions.pdf'} minimal={true} outlined={true}>
          <T id={'pdf_preview.download.button'} />
        </AnchorButton>
      </div>

      <PdfDocumentPreview height={760} width={1000} isLoading={isLoading} url={pdfUrl} />
    </DialogContent>
  );
}
