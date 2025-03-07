import { handleStringChange } from '@bigcapital/webapp/utils';
import { Radio, RadioGroup } from '@blueprintjs/core';
import { FastField } from 'formik';
// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

export default function RadiosAccountingBasis(props) {
  const { key = 'basis', ...rest } = props;

  return (
    <FastField name={'basis'}>
      {({ form: { setFieldValue }, field: { value } }) => (
        <RadioGroup
          inline={true}
          label={intl.get('accounting_basis')}
          name="basis"
          onChange={handleStringChange((value) => {
            setFieldValue(key, value);
          })}
          className={'radio-group---accounting-basis'}
          selectedValue={value}
          {...rest}
        >
          <Radio label={intl.get('cash')} value="cash" />
          <Radio label={intl.get('accrual')} value="accrual" />
        </RadioGroup>
      )}
    </FastField>
  );
}
