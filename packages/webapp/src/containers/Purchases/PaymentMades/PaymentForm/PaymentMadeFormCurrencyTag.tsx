import { BaseCurrency, BaseCurrencyRoot } from '@bigcapital/webapp/components';
// @ts-nocheck
import React from 'react';
import { usePaymentMadeFormContext } from './PaymentMadeFormProvider';

/**
 * Payment made form currency tag.
 * @returns
 */
export default function PaymentMadeFormCurrencyTag() {
  const { isForeignVendor, selectVendor } = usePaymentMadeFormContext();

  if (!isForeignVendor) {
    return null;
  }

  return (
    <BaseCurrencyRoot>
      <BaseCurrency currency={selectVendor?.currency_code} />
    </BaseCurrencyRoot>
  );
}
