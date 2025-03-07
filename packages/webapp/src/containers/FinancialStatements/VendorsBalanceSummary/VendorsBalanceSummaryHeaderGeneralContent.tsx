import { Checkbox, FormGroup, Position } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FastField } from 'formik';
// @ts-nocheck
import React from 'react';

import {
  Col,
  FFormGroup,
  FieldHint,
  Row,
  FormattedMessage as T,
  VendorsMultiSelect,
} from '@bigcapital/webapp/components';
import { handleDateChange, inputIntent, momentFormatter, tansformDateValue } from '@bigcapital/webapp/utils';
import FinancialStatementsFilter from '../FinancialStatementsFilter';
import { filterVendorsOptions } from '../constants';
import { useVendorsBalanceSummaryGeneralPanelContext } from './VendorsBalanceSummaryHeaderGeneralProvider';

/**
 * Vendors balance header - General panel - Content.
 */
export default function VendorsBalanceSummaryHeaderGeneralContent() {
  const { vendors } = useVendorsBalanceSummaryGeneralPanelContext();

  return (
    <div>
      <Row>
        <Col xs={5}>
          <FastField name={'asDate'}>
            {({ form, field: { value }, meta: { error } }) => (
              <FormGroup
                label={<T id={'as_date'} />}
                labelInfo={<FieldHint />}
                fill={true}
                intent={inputIntent({ error })}
              >
                <DateInput
                  {...momentFormatter('YYYY/MM/DD')}
                  value={tansformDateValue(value)}
                  onChange={handleDateChange((selectedDate) => {
                    form.setFieldValue('asDate', selectedDate);
                  })}
                  popoverProps={{ position: Position.BOTTOM, minimal: true }}
                  minimal={true}
                  fill={true}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FastField name={'percentage_column'} type={'checkbox'}>
            {({ field }) => (
              <FormGroup labelInfo={<FieldHint />}>
                <Checkbox
                  inline={true}
                  small={true}
                  label={<T id={'percentage_of_column'} />}
                  name={'percentage_column'}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FinancialStatementsFilter
            items={filterVendorsOptions}
            label={<T id={'vendors.label_filter_vendors'} />}
            initialSelectedItem={'with-transactions'}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FFormGroup label={<T id={'specific_vendors'} />} name={'vendorsIds'}>
            <VendorsMultiSelect name={'vendorsIds'} items={vendors} />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
}
