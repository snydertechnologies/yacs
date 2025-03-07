import { Group } from '@bigcapital/webapp/components';
import { DRAWERS } from '@bigcapital/webapp/constants/drawers';
import withDrawerActions from '@bigcapital/webapp/containers/Drawer/withDrawerActions';
import { Button, Classes, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
// @ts-nocheck
import * as R from 'ramda';
import styled from 'styled-components';

function CategorizeTransactionFormFooterRoot({
  // #withDrawerActions
  closeDrawer,
}) {
  const { isSubmitting } = useFormikContext();

  const handleClose = () => {
    closeDrawer(DRAWERS.CATEGORIZE_TRANSACTION);
  };

  return (
    <Root>
      <div className={Classes.DRAWER_FOOTER}>
        <Group spacing={10}>
          <Button intent={Intent.PRIMARY} loading={isSubmitting} style={{ minWidth: '75px' }} type="submit">
            Save
          </Button>

          <Button disabled={isSubmitting} onClick={handleClose} style={{ minWidth: '75px' }}>
            Close
          </Button>
        </Group>
      </div>
    </Root>
  );
}

export const CategorizeTransactionFormFooter = R.compose(withDrawerActions)(CategorizeTransactionFormFooterRoot);

const Root = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
`;
