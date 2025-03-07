import { BranchMultiSelect, Col, Row } from '@bigcapital/webapp/components';
import { Classes, FormGroup } from '@blueprintjs/core';
// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import {
  ARAgingSummaryHeaderDimensionsProvider,
  useARAgingSummaryHeaderDimensonsContext,
} from './ARAgingSummaryHeaderDimensionsProvider';

/**
 * ARAging summary header dimensions.
 * @returns {JSX.Element}
 */
export default function ARAgingSummaryHeaderDimensions() {
  return (
    <ARAgingSummaryHeaderDimensionsProvider>
      <ARAgingSummaryHeaderDimensionsContent />
    </ARAgingSummaryHeaderDimensionsProvider>
  );
}

/**
 * ARAging summary header dimensions content.
 * @returns {JSX.Element}
 */
function ARAgingSummaryHeaderDimensionsContent() {
  const { branches } = useARAgingSummaryHeaderDimensonsContext();

  // Detarmines the feature whether is enabled.
  const { featureCan } = useFeatureCan();

  const isBranchesFeatureCan = featureCan(Features.Branches);

  return (
    <Row>
      <Col xs={4}>
        {isBranchesFeatureCan && (
          <FormGroup label={intl.get('branches_multi_select.label')} className={Classes.FILL}>
            <BranchMultiSelect name={'branchesIds'} branches={branches} />
          </FormGroup>
        )}
      </Col>
    </Row>
  );
}
