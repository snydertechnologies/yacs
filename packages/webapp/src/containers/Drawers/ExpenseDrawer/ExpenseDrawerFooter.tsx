// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { T, TotalLineBorderStyle, TotalLineTextStyle, TotalLines } from '@bigcapital/webapp/components';
import { TotalLine } from '@bigcapital/webapp/components';
import { useExpenseDrawerContext } from './ExpenseDrawerProvider';

/**
 * Footer details of expense readonly details.
 */
export default function ExpenseDrawerFooter() {
  const { expense } = useExpenseDrawerContext();

  return (
    <ExpenseDetailsFooterRoot>
      <ExpenseTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={<T id={'expense.details.subtotal'} />}
          value={expense.formatted_amount}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        <TotalLine
          title={<T id={'expense.details.total'} />}
          value={expense.formatted_amount}
          borderStyle={TotalLineBorderStyle.DoubleDark}
          textStyle={TotalLineTextStyle.Bold}
        />
      </ExpenseTotalLines>
    </ExpenseDetailsFooterRoot>
  );
}

export const ExpenseDetailsFooterRoot = styled.div``;

export const ExpenseTotalLines = styled(TotalLines)`
  margin-left: auto;
`;
