import { debounce } from 'lodash';
import { isUndefined } from 'lodash';
// @ts-nocheck
import React from 'react';

import { UniversalSearch } from '@bigcapital/webapp/components';
import { useUniversalSearch } from '@bigcapital/webapp/hooks/query';

import { RESOURCES_TYPES } from '@bigcapital/webapp/constants/resourcesTypes';
import { compose } from '@bigcapital/webapp/utils';
import withUniversalSearch from './withUniversalSearch';
import withUniversalSearchActions from './withUniversalSearchActions';

import DashboardUniversalSearchHotkeys from './DashboardUniversalSearchHotkeys';
import DashboardUniversalSearchItemActions from './DashboardUniversalSearchItemActions';
import { DashboardUniversalSearchItem } from './components';
import { useGetUniversalSearchTypeOptions } from './utils';

/**
 * Dashboard universal search.
 */
function DashboardUniversalSearch({
  // #withUniversalSearchActions
  setSelectedItemUniversalSearch,

  // #withUniversalSearch
  globalSearchShow,
  closeGlobalSearch,
  defaultUniversalResourceType,
}) {
  const searchTypeOptions = useGetUniversalSearchTypeOptions();

  // Search keyword.
  const [searchKeyword, setSearchKeyword] = React.useState('');

  // Default search type.
  const [defaultSearchType, setDefaultSearchType] = React.useState(
    defaultUniversalResourceType || RESOURCES_TYPES.CUSTOMR,
  );
  // Search type.
  const [searchType, setSearchType] = React.useState(defaultSearchType);

  // Sync default search type with default universal resource type.
  React.useEffect(() => {
    if (!isUndefined(defaultUniversalResourceType) && defaultSearchType !== defaultUniversalResourceType) {
      setSearchType(defaultUniversalResourceType);
      setDefaultSearchType(defaultUniversalResourceType);
    }
  }, [defaultSearchType, defaultUniversalResourceType]);

  // Fetch accounts list according to the given custom view id.
  const {
    data,
    remove,
    isFetching: isSearchFetching,
    isLoading: isSearchLoading,
    refetch,
  } = useUniversalSearch(searchType, searchKeyword, {
    keepPreviousData: true,
    enabled: false,
  });

  // Handle query change.
  const handleQueryChange = (query) => {
    setSearchKeyword(query);
  };
  // Handle search type change.
  const handleSearchTypeChange = (type) => {
    remove();
    setSearchType(type.key);
  };
  // Handle overlay of universal search close.
  const handleClose = () => {
    closeGlobalSearch();
  };
  // Handle universal search item select.
  const handleItemSelect = (item) => {
    setSelectedItemUniversalSearch(searchType, item.id);
    closeGlobalSearch();
    setSearchKeyword('');
  };
  const debounceFetch = React.useRef(
    debounce(() => {
      refetch();
    }, 200),
  );

  React.useEffect(() => {
    if (searchKeyword && searchType) {
      debounceFetch.current();
    }
  }, [searchKeyword, searchType]);

  // Handles the overlay once be closed.
  const handleOverlayClosed = () => {
    setSearchKeyword('');
  };

  if (searchTypeOptions.length === 0) {
    return null;
  }

  return (
    <div className="dashboard__universal-search">
      <UniversalSearch
        isOpen={globalSearchShow}
        isLoading={isSearchFetching}
        items={data}
        overlayProps={{
          onClose: handleClose,
          onClosed: handleOverlayClosed,
        }}
        searchResource={searchType}
        onQueryChange={handleQueryChange}
        onSearchTypeChange={handleSearchTypeChange}
        onItemSelect={handleItemSelect}
        itemRenderer={DashboardUniversalSearchItem}
        query={searchKeyword}
        searchTypeOptions={searchTypeOptions}
      />
      <DashboardUniversalSearchItemActions />
      <DashboardUniversalSearchHotkeys />
    </div>
  );
}

export default compose(
  withUniversalSearchActions,
  withUniversalSearch(({ globalSearchShow, defaultUniversalResourceType }) => ({
    globalSearchShow,
    defaultUniversalResourceType,
  })),
)(DashboardUniversalSearch);
