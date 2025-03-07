// @ts-nocheck
import { AutoSizer, List, WindowScroller } from 'https://cdn.jsdelivr.net/npm/react-virtualized@9.22.5/+esm'; // won't work from node_modules
import { CLASSES } from '@bigcapital/webapp/constants/classes';
import React, { useContext } from 'react';
import TableContext from './TableContext';

/**
 * Table virtualized list row.
 */
function TableVirtualizedListRow({ index, isScrolling, isVisible, style }) {
  const {
    table: { page, prepareRow },
    props: { TableRowRenderer },
  } = useContext(TableContext);

  const row = page[index];
  prepareRow(row);

  return <TableRowRenderer row={row} style={style} />;
}

/**
 * Table virtualized list rows.
 */
export function TableVirtualizedListRows() {
  const {
    table: { page },
    props: { vListrowHeight, vListOverscanRowCount },
  } = useContext(TableContext);

  // Dashboard content pane.
  const dashboardContentPane = React.useMemo(() => document.querySelector(`.${CLASSES.DASHBOARD_CONTENT_PANE}`), []);

  const rowRenderer = React.useCallback(({ key, ...args }) => <TableVirtualizedListRow {...args} key={key} />, []);

  return (
    <WindowScroller scrollElement={dashboardContentPane}>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <AutoSizer disableHeight>
          {({ width }) => (
            <List
              autoHeight={true}
              className={'List'}
              height={height}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              overscanRowCount={vListOverscanRowCount}
              rowCount={page.length}
              rowHeight={vListrowHeight}
              rowRenderer={rowRenderer}
              scrollTop={scrollTop}
              width={width}
            />
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  );
}
