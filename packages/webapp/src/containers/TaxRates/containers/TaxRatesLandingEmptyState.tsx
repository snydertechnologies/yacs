import { Can, EmptyStatus, FormattedMessage as T } from '@bigcapital/webapp/components';
import { AbilitySubject, SaleInvoiceAction } from '@bigcapital/webapp/constants/abilityOption';
import { DialogsName } from '@bigcapital/webapp/constants/dialogs';
import withDialogActions from '@bigcapital/webapp/containers/Dialog/withDialogActions';
import { Button, Intent } from '@blueprintjs/core';
import * as R from 'ramda';
// @ts-nocheck
import React from 'react';

function TaxRatesLandingEmptyStateRoot({
  // #withDialogAction
  openDialog,
}) {
  return (
    <EmptyStatus
      title={"The organization doesn't have taxes, yet!"}
      description={<p>Setup the organization taxes to start tracking taxes on sales transactions.</p>}
      action={
        <>
          <Can I={SaleInvoiceAction.Create} a={AbilitySubject.Invoice}>
            <Button
              intent={Intent.PRIMARY}
              large={true}
              onClick={() => {
                openDialog(DialogsName.TaxRateForm);
              }}
            >
              New tax rate
            </Button>
            <Button intent={Intent.NONE} large={true}>
              <T id={'learn_more'} />
            </Button>
          </Can>
        </>
      }
    />
  );
}

export const TaxRatesLandingEmptyState = R.compose(withDialogActions)(TaxRatesLandingEmptyStateRoot);
