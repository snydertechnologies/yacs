import {
  Col,
  CustomersMultiSelect,
  FFormGroup,
  FieldHint,
  Row,
  FormattedMessage as T,
} from '@bigcapital/webapp/components';
import { handleDateChange, inputIntent, momentFormatter, tansformDateValue } from '@bigcapital/webapp/utils';
import { Checkbox, FormGroup, Position } from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
// @ts-nocheck
import { FastField } from 'formik';
import FinancialStatementsFilter from '../FinancialStatementsFilter';
import { filterCustomersOptions } from '../constants';
import { useCustomersBalanceSummaryGeneralContext } from './CustomersBalanceSummaryGeneralProvider';

/**
 * Customers balance header - General panel - Content
 */
export default function CustomersBalanceSummaryGeneralPanelContent() {
  const { customers } = useCustomersBalanceSummaryGeneralContext();

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
                  name={'percentage'}
                  small={true}
                  label={<T id={'percentage_of_column'} />}
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
            items={filterCustomersOptions}
            label={<T id={'customers.label_filter_customers'} />}
            initialSelectedItem={'with-transactions'}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={5}>
          <FFormGroup name={'customersIds'} label={<T id={'specific_customers'} />}>
            <CustomersMultiSelect name={'customersIds'} items={customers} />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
}
