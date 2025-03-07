import classNames from 'classnames';
// @ts-nocheck
import React from 'react';

import Style from '@bigcapital/webapp/style/components/DataTable/DataTableEmptyStatus.module.scss';

/**
 * Datatable empty status.
 */
export function EmptyStatus({ title, description, action, children }) {
  return (
    <div className={classNames(Style.root)}>
      <h1 className={classNames(Style.root_title)}>{title}</h1>
      <div className={classNames(Style.root_desc)}>{description}</div>
      <div className={classNames(Style.root_actions)}>{action}</div>
      {children}
    </div>
  );
}
