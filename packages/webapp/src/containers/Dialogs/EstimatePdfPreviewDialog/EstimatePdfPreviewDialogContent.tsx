import { AnchorButton } from '@blueprintjs/core';
// @ts-nocheck
import React from 'react';

import { DialogContent, PdfDocumentPreview, T } from '@bigcapital/webapp/components';
import { usePdfEstimate } from '@bigcapital/webapp/hooks/query';

import withDialogActions from '@bigcapital/webapp/containers/Dialog/withDialogActions';
import { compose } from '@bigcapital/webapp/utils';

function EstimatePdfPreviewDialogContent({
  subscriptionForm: { estimateId },
  dialogName,
  // #withDialogActions
  closeDialog,
}) {
  const { isLoading, pdfUrl } = usePdfEstimate(estimateId);

  return (
    <DialogContent>
      <div className="dialog__header-actions">
        <AnchorButton href={pdfUrl} target={'__blank'} minimal={true} outlined={true}>
          <T id={'pdf_preview.preview.button'} />
        </AnchorButton>

        <AnchorButton href={pdfUrl} download={'estimate.pdf'} minimal={true} outlined={true}>
          <T id={'pdf_preview.download.button'} />
        </AnchorButton>
      </div>

      <PdfDocumentPreview height={760} width={1000} isLoading={isLoading} url={pdfUrl} />
    </DialogContent>
  );
}

export default compose(withDialogActions)(EstimatePdfPreviewDialogContent);
