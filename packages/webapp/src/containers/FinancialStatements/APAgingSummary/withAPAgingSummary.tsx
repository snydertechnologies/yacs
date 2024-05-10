// @ts-nocheck
import { connect } from 'react-redux';
import { APAgingSummaryFilterDrawerSelector } from '@/store/financialStatement/financialStatements.selectors';

export default (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
      APAgingSummaryFilterDrawer: APAgingSummaryFilterDrawerSelector(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
