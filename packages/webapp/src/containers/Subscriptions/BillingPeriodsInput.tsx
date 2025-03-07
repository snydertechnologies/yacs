import { Field } from 'formik';
import * as R from 'ramda';
// @ts-nocheck
import React from 'react';

import { SubscriptionPeriods, T } from '@bigcapital/webapp/components';

import withPlan from './withPlan';

/**
 * Sunscription periods enhanced.
 */
const SubscriptionPeriodsEnhanced = R.compose(withPlan(({ plan }) => ({ plan })))(({ plan, ...restProps }) => {
  if (!plan) return null;

  return <SubscriptionPeriods periods={plan.periods} {...restProps} />;
});

/**
 * Billing periods.
 */
export default function BillingPeriods() {
  return (
    <section className="billing-plans__section">
      <h1 className="title">
        <T id={'setup.plans.select_period.title'} />
      </h1>
      <div className="description">
        <p className="paragraph">
          <T id={'setup.plans.select_period.description'} />
        </p>
      </div>

      <Field name={'period'}>
        {({ field: { value }, form: { values, setFieldValue } }) => (
          <SubscriptionPeriodsEnhanced
            selectedPeriod={value}
            planSlug={values.plan_slug}
            onPeriodSelect={(period) => {
              setFieldValue('period', period);
            }}
          />
        )}
      </Field>
    </section>
  );
}
