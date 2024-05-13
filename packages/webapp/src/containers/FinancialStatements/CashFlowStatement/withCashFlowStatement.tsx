import { getCashFlowStatementFilterDrawer } from '@bigcapital/webapp/store/financialStatement/financialStatements.selectors';
// @ts-nocheck
import { connect } from 'react-redux';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      cashFlowStatementDrawerFilter: getCashFlowStatementFilterDrawer(state),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
