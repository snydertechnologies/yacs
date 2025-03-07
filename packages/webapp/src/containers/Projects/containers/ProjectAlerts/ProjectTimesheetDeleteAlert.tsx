import { FormattedHTMLMessage, FormattedMessage as T } from '@bigcapital/webapp/components';
import { AppToaster } from '@bigcapital/webapp/components';
import { Alert, Intent } from '@blueprintjs/core';
// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { useDeleteProjectTimeEntry } from '../../hooks';

import withAlertActions from '@bigcapital/webapp/containers/Alert/withAlertActions';
import withAlertStoreConnect from '@bigcapital/webapp/containers/Alert/withAlertStoreConnect';

import { compose } from '@bigcapital/webapp/utils';

/**
 * Project timesheet delete alert.
 * @returns
 */
function ProjectTimesheetDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { timesheetId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: deleteProjectTimeEntryMutate, isLoading } = useDeleteProjectTimeEntry();

  // handle cancel delete alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // handleConfirm delete project time sheet.
  const handleConfirmProjectTimesheetDelete = () => {
    deleteProjectTimeEntryMutate(timesheetId)
      .then(() => {
        AppToaster.show({
          message: intl.get('project_time_entry.alert.delete_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {},
      )
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmProjectTimesheetDelete}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage id={'project_time_entry.alert.once_delete_this_project'} />
      </p>
    </Alert>
  );
}
export default compose(withAlertStoreConnect(), withAlertActions)(ProjectTimesheetDeleteAlert);
