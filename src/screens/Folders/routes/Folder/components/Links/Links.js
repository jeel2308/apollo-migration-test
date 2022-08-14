/**--external-- */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _includes from 'lodash/includes';
import _map from 'lodash/map';
import { Checkbox, Spinner } from '@chakra-ui/react';
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _size from 'lodash/size';
import _pipe from 'lodash/flow';
import _reverse from 'lodash/reverse';

/**--internal-- */
import { withQuery } from '#components';
import {
  deleteLink,
  updateLink,
  DEFAULT_PAGE_SIZE,
  getTotalFolders,
} from '#modules/Module';
import {
  compose,
  copyToClipboard,
  scrollToBottom,
  getFieldPresenceStatus,
  checkScrollAtTop,
  mergeRefs,
} from '#Utils';
import { getFolderDetailsQuery } from '#modules/Queries';
import { getFolderDetailsFromCache } from '#modules/GraphqlHelpers';
import { FETCH_MORE_LINK, ADD_LINK, MOVE_OR_DELETE_LINK } from '../FolderUtils';
import { ScrollIntoViewWrapper } from '#components';

/**--relative-- */
import classes from './Links.module.scss';
import Link from './Link';
import { getLinkActions, getBulkLinkActions } from './LinkUtils';
import EditOrCreateLinkModal from '../EditOrCreateLinkModal';
import Actions from './Actions';
import FolderListModal from './FolderListModal';
import DeleteLinkModal from './DeleteLinkModal';

const Links = (props) => {
  const {
    folderDetails,
    folderId,
    deleteLink,
    isCompleted,
    updateLink,
    networkStatus,
    hasNextPage,
    fetchMore,
    showMoveAction,
    searchText,
    linkOperation,
    setLinkOperation,
  } = props;
  const { linksV2 } = folderDetails;
  const links = _pipe((data) => {
    const edges = _get(data, 'edges', []);
    return _map(edges, ({ node }) => node);
  }, _reverse)(linksV2);
  const totalPresentLinks = _size(links);

  const [showEditLinkModal, setShowEditLinkModal] = useState(false);
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [showBulkSelection, setShowBulkSelection] = useState(false);
  const [showFolderList, setShowFolderList] = useState(false);
  const [showDeleteLinkModal, setDeleteLinkModalVisibility] = useState(false);
  const [showPaginationLoader, setShowPaginationLoader] = useState(false);

  const listScrollRef = useRef();
  const linksNodeRefs = useRef([]);

  const previousTotalPresentLinksRef = useRef(_size(links));

  const updateLinksNodeRefs = (node, index) => {
    linksNodeRefs.current[index] = node;
  };

  useEffect(() => {
    if (linkOperation === FETCH_MORE_LINK) {
      const addedLinksCount =
        totalPresentLinks - previousTotalPresentLinksRef.current;

      const totalVerticalDistance =
        linksNodeRefs.current?.[addedLinksCount]?.getBoundingClientRect().top ??
        0;

      listScrollRef.current.scrollTop = totalVerticalDistance - 75 - 75;

      setLinkOperation(null);
    } else if (linkOperation === MOVE_OR_DELETE_LINK) {
      setLinkOperation(null);
    } else {
      listScrollRef.current && scrollToBottom(listScrollRef.current);
    }
  }, [totalPresentLinks, folderId, isCompleted, searchText]);

  useEffect(() => {
    previousTotalPresentLinksRef.current = totalPresentLinks;
  }, [totalPresentLinks]);

  useEffect(() => {
    disableBulkSelectionMode();
    setLinkOperation(null);
  }, [folderId]);

  useEffect(() => {
    if (networkStatus === 7) {
      setShowPaginationLoader(false);
    }
  }, [networkStatus]);

  const openEditLinkModal = useCallback(({ linkId }) => {
    setShowEditLinkModal(true);
    setSelectedLinks([linkId]);
  }, []);

  const closeEditLinkModal = useCallback(() => {
    setShowEditLinkModal(false);
    setSelectedLinks([]);
  }, []);

  const enableBulkSelectionMode = useCallback(({ linkId }) => {
    setShowBulkSelection(true);
    setSelectedLinks([linkId]);
  }, []);

  const disableBulkSelectionMode = useCallback(() => {
    setShowBulkSelection(false);
    setSelectedLinks([]);
  }, []);

  const closeFolderList = useCallback(() => {
    setShowFolderList(false);
    setSelectedLinks([]);
    disableBulkSelectionMode();
  }, []);

  const toggleDeleteLinkModalVisibility = useCallback(() => {
    setDeleteLinkModalVisibility((prev) => !prev);
  }, []);

  const onDeleteLinks = async () => {
    toggleDeleteLinkModalVisibility();
    disableBulkSelectionMode();
    setLinkOperation(MOVE_OR_DELETE_LINK);

    await deleteLink({
      linkIds: selectedLinks,
      isCompleted,
      folderId,
      searchText,
    });

    if (_size(links) <= DEFAULT_PAGE_SIZE) {
      setShowPaginationLoader(false);
      fetchMoreFeed();
    }
  };

  const onCancelLinkDelete = () => {
    toggleDeleteLinkModalVisibility();
    setSelectedLinks([]);
  };

  const onUpdateFolder = async ({ folderId: updatedFolderId }) => {
    setLinkOperation(MOVE_OR_DELETE_LINK);
    await updateLink({
      linksDetails: _map(selectedLinks, (id) => ({
        id,
        folderId: updatedFolderId,
      })),
      oldStatus: isCompleted,
      oldFolderId: folderId,
      searchText,
    });

    closeFolderList();

    if (_size(links) <= DEFAULT_PAGE_SIZE) {
      setShowPaginationLoader(false);
      fetchMoreFeed();
    }
  };

  const handleActions = async ({ value, linkId }) => {
    switch (value) {
      case 'EDIT': {
        openEditLinkModal({ linkId });
        break;
      }

      case 'DELETE': {
        setSelectedLinks([linkId]);
        toggleDeleteLinkModalVisibility();

        break;
      }

      case 'MARK_AS_PENDING':
      case 'MARK_AS_COMPLETE': {
        setLinkOperation(MOVE_OR_DELETE_LINK);
        await updateLink({
          linksDetails: [{ id: linkId, isCompleted: !isCompleted }],
          oldStatus: isCompleted,
          oldFolderId: folderId,
          searchText,
        });

        if (_size(links) <= DEFAULT_PAGE_SIZE) {
          setShowPaginationLoader(false);
          fetchMoreFeed();
        }

        break;
      }

      case 'SELECT': {
        enableBulkSelectionMode({ linkId });
        break;
      }

      case 'MOVE': {
        setShowFolderList(true);
        setSelectedLinks([linkId]);
        break;
      }

      case 'COPY': {
        const { url } = _find(links, ({ id }) => id == linkId);
        copyToClipboard({ text: url });
        break;
      }

      default: {
        return;
      }
    }
  };

  const handleBulkSelectionActions = async ({ type }) => {
    switch (type) {
      case 'DELETE': {
        toggleDeleteLinkModalVisibility();

        break;
      }
      case 'CANCEL': {
        disableBulkSelectionMode();
        break;
      }
      case 'UPDATE_STATUS': {
        setLinkOperation(MOVE_OR_DELETE_LINK);
        await updateLink({
          linksDetails: _map(selectedLinks, (id) => ({
            id,
            isCompleted: !isCompleted,
          })),
          oldStatus: isCompleted,
          oldFolderId: folderId,
          searchText,
        });

        disableBulkSelectionMode();

        if (_size(links) <= DEFAULT_PAGE_SIZE) {
          setShowPaginationLoader(false);
          fetchMoreFeed();
        }

        break;
      }
      case 'MOVE': {
        setShowFolderList(true);
        break;
      }

      default: {
        return;
      }
    }
  };

  const updateSelectedLinks = ({ id }) => {
    setSelectedLinks((selectedLinks) => {
      const filteredLinks = _filter(
        selectedLinks,
        (selectedLinkId) => selectedLinkId !== id
      );
      if (_size(filteredLinks) === _size(selectedLinks)) {
        return [...selectedLinks, id];
      }
      return filteredLinks;
    });
  };

  const totalLinks = _size(links);

  const isPaginationQueryRunning = networkStatus === 3;

  const fetchMoreFeed = () => {
    if (!isPaginationQueryRunning && hasNextPage) {
      fetchMore();
    }
  };

  const onScroll = async (e) => {
    const isContainerAtTop = checkScrollAtTop(e.target);

    if (isContainerAtTop && hasNextPage && !isPaginationQueryRunning) {
      fetchMore();
      setLinkOperation(FETCH_MORE_LINK);
      setShowPaginationLoader(true);
    }
  };

  const linkAddedOrUpdatedCallback = ({
    isCompleted: updatedStatus,
    folderId: updatedFolderId,
  }) => {
    const isLinkStatusUpdated = getFieldPresenceStatus(updatedStatus);

    const isFolderUpdated = getFieldPresenceStatus(updatedFolderId);

    if (isLinkStatusUpdated || isFolderUpdated) {
      if (_size(links) <= DEFAULT_PAGE_SIZE) {
        setShowPaginationLoader(false);
        setLinkOperation(MOVE_OR_DELETE_LINK);
        fetchMoreFeed();
      }
    }
  };

  const renderLinks = () => {
    if (_isEmpty(links)) {
      return 'No links';
    }
    const linkActions = getLinkActions({ isCompleted, showMoveAction });
    return _map(links, (link, index) => {
      const { id } = link;
      const isLinkSelected = _includes(selectedLinks, id);

      const onChange = (e) => {
        e.stopPropagation();
        updateSelectedLinks({ id });
      };

      const onLinkClick = (e) => {
        if (e.defaultPrevented) {
          return;
        } else if (showBulkSelection) {
          updateSelectedLinks({ id });
        } else {
          window.open(link.url, '_blank');
        }
      };

      if (index === totalLinks - 1 && linkOperation === ADD_LINK) {
        return (
          <ScrollIntoViewWrapper
            key={id}
            dependencyForChangingScrollPosition={[]}
          >
            {({ ref, scrollIntoView }) => {
              const onMetadataLoaded = () => {
                scrollIntoView();
                setLinkOperation(null);
              };

              return (
                <div
                  className={classes.linkOption}
                  ref={(node) =>
                    mergeRefs({
                      node,
                      refs: [ref, (node) => updateLinksNodeRefs(node, index)],
                    })
                  }
                >
                  {showBulkSelection && (
                    <Checkbox
                      size="lg"
                      isChecked={isLinkSelected}
                      backgroundColor="white"
                      borderColor="rgba(0,0,0,0.5)"
                      onChange={onChange}
                    />
                  )}
                  <div className={classes.linkContainer}>
                    <Link
                      {...link}
                      dropDownOptions={linkActions}
                      handleActions={handleActions}
                      onLinkClick={onLinkClick}
                      onMetadataLoaded={onMetadataLoaded}
                    />
                  </div>
                </div>
              );
            }}
          </ScrollIntoViewWrapper>
        );
      }

      return (
        <div
          className={classes.linkOption}
          key={id}
          ref={(node) => updateLinksNodeRefs(node, index)}
        >
          {showBulkSelection && (
            <Checkbox
              size="lg"
              isChecked={isLinkSelected}
              backgroundColor="white"
              borderColor="rgba(0,0,0,0.5)"
              onChange={onChange}
            />
          )}
          <div className={classes.linkContainer}>
            <Link
              {...link}
              dropDownOptions={linkActions}
              handleActions={handleActions}
              onLinkClick={onLinkClick}
            />
          </div>
        </div>
      );
    });
  };

  const renderPaginationLoader = () => {
    return isPaginationQueryRunning && showPaginationLoader ? (
      <div className={classes.spinnerContainer}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </div>
    ) : null;
  };

  return (
    <div className={classes.container}>
      {renderPaginationLoader()}
      <div
        className={classes.scrollContainer}
        ref={listScrollRef}
        onScroll={onScroll}
      >
        <div className={classes.listContainer}>
          {renderLinks()}

          {showEditLinkModal && (
            <EditOrCreateLinkModal
              linkId={selectedLinks?.[0] ?? ''}
              closeModal={closeEditLinkModal}
              folderId={folderId}
              linkAddedOrUpdatedCallback={linkAddedOrUpdatedCallback}
              searchText={searchText}
            />
          )}
          {showFolderList && (
            <FolderListModal
              selectedLinks={selectedLinks}
              closeModal={closeFolderList}
              currentFolderId={folderId}
              onUpdateFolder={onUpdateFolder}
            />
          )}
          {showDeleteLinkModal && (
            <DeleteLinkModal
              totalLinks={_size(selectedLinks)}
              onCancelClick={onCancelLinkDelete}
              onDeleteClick={onDeleteLinks}
            />
          )}
        </div>
      </div>
      {showBulkSelection && (
        <Actions
          allowedBulkActions={getBulkLinkActions({
            isCompleted,
            totalLinks,
            showMoveAction,
          })}
          onActionClick={handleBulkSelectionActions}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  const userId = _get(state, 'userDetails.id', null);

  const totalFolders = getTotalFolders({ userId });

  const showMoveAction = totalFolders > 1;

  return { showMoveAction };
};

const mapActionCreators = {
  deleteLink,
  updateLink,
};

export default compose(
  connect(mapStateToProps, mapActionCreators),
  withQuery(getFolderDetailsQuery, {
    name: 'getFolderDetails',
    displayName: 'getFolderDetails',
    fetchPolicy: 'cache-and-network',
    getVariables: ({ folderId, isCompleted, searchText }) => {
      return {
        input: { id: folderId, type: 'FOLDER' },
        linkFilterInputV2: {
          isCompleted,
          first: DEFAULT_PAGE_SIZE,
          searchText,
        },
      };
    },
    getSkipQueryStatus: ({ folderId }) => !folderId,
    mapQueryDataToProps: ({
      getFolderDetails,
      ownProps: { folderId, isCompleted, searchText },
    }) => {
      const { networkStatus } = getFolderDetails;

      /**
       * Reading from cache is needed as sometimes getFolderDetails returns wrong cached data
       */
      const folderDetails = getFolderDetailsFromCache({
        folderId,
        linkFilters: { isCompleted, first: DEFAULT_PAGE_SIZE, searchText },
        showOptimistic: true,
      });

      const isData = !_isEmpty(folderDetails);
      const isLoading = _includes([1, 2], networkStatus);

      const pageInfo = _get(folderDetails, 'linksV2.pageInfo', {});
      const { endCursor, hasNextPage } = pageInfo;

      const fetchMore = async ({ first = DEFAULT_PAGE_SIZE } = {}) => {
        return await getFolderDetails.fetchMore({
          //BUG: setting query option will not update network status while refetching
          variables: {
            input: {
              id: folderId,
              type: 'FOLDER',
            },
            linkFilterInputV2: {
              isCompleted,
              first,
              after: endCursor,
              searchText,
            },
          },
          updateQuery: (previousFeed, { fetchMoreResult }) => {
            const { node: oldNode } = previousFeed;
            const { node: newNode } = fetchMoreResult;

            const { linksV2: oldLinksV2 } = oldNode;
            const { linksV2: newLinksV2 } = newNode;

            const { edges: oldEdges } = oldLinksV2;
            const { edges: newEdges } = newLinksV2;

            const updatedEdges = [...oldEdges, ...newEdges];

            const { pageInfo: updatedPageInfo } = newLinksV2;

            return {
              ...previousFeed,
              node: {
                ...oldNode,
                linksV2: {
                  ...oldLinksV2,
                  edges: updatedEdges,
                  pageInfo: updatedPageInfo,
                },
              },
            };
          },
        });
      };

      return {
        isData,
        isLoading,
        folderDetails,
        networkStatus,
        hasNextPage,
        fetchMore,
      };
    },
  })
)(Links);
