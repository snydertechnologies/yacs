import { CLASSES } from '@bigcapital/webapp/constants/classes';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import VendorCreditNoteFormHeaderFields from './VendorCreditNoteFormHeaderFields';

import { PageFormBigNumber } from '@bigcapital/webapp/components';
import { getEntriesTotal } from '@bigcapital/webapp/containers/Entries/utils';

/**
 * Vendor Credit note header.
 */
function VendorCreditNoteFormHeader() {
  const {
    values: { entries, currency_code },
  } = useFormikContext();

  // Calculate the total amount.
  const totalAmount = React.useMemo(() => getEntriesTotal(entries), [entries]);

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER)}>
      <VendorCreditNoteFormHeaderFields />
      <PageFormBigNumber
        label={intl.get('vendor_credits.label.amount_to_credit')}
        amount={totalAmount}
        currencyCode={currency_code}
      />
    </div>
  );
}

export default VendorCreditNoteFormHeader;
