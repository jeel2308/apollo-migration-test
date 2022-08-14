import client from '../apolloClient';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _size from 'lodash/size';
import _map from 'lodash/map';
import _filter from 'lodash/filter';
import _pipe from 'lodash/flow';

import {
  setUserInfoInStorage,
  getFieldPresenceStatus,
  localSearch,
} from '../Utils';
import {
  updateUserFoldersInCache,
  addLinkInCache,
  deleteLinkFromCache,
  getUserFoldersFromCache,
} from './GraphqlHelpers';
import {
  addFolderMutation,
  updateFolderMutation,
  deleteFolderMutation,
  addLinkMutation,
  updateLinkMutation,
  deleteLinkMutation,
  updateLinksMetadataMutation,
  updateUserMutation,
} from './Mutations';

/**--CONSTANTS AND UTILS-- */
export const DEFAULT_PAGE_SIZE = 9;

const origin = process.env.REACT_APP_SERVER_URL;

export const getTotalFolders = ({ userId }) => {
  const { folders } = getUserFoldersFromCache({ userId });

  return _size(folders);
};

const getRequestPromise = ({ route, data }) => {
  return fetch(`${origin}/${route}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    referrerPolicy: 'no-referrer',
  });
};

/**--REDUX ACTIONS-- */
const SET_LOADER_VISIBILITY = 'SET_LOADER_VISIBILITY';

const UPDATE_USER_LOGGED_IN_STATUS = 'UPDATE_USER_LOGGED_IN_STATUS';

const SET_USER_DETAILS = 'SET_USER_DETAILS';

const SET_TOAST_MESSAGE = 'SET_TOAST_MESSAGE';

/**--REDUX ACTION GENERATORS-- */
export const setLoaderVisibility = (payload) => {
  return { type: SET_LOADER_VISIBILITY, payload };
};

export const updateUserLoggedInStatus = (payload) => {
  return { type: UPDATE_USER_LOGGED_IN_STATUS, payload };
};

export const setUserDetails = (payload) => {
  return { type: SET_USER_DETAILS, payload };
};

export const setToastMessage = (payload) => {
  return { type: SET_TOAST_MESSAGE, payload };
};

/**--REDUX THUNKS-- */
export const addFolder =
  ({ name }) =>
  async (dispatch, getState) => {
    const state = getState();
    try {
      dispatch(setLoaderVisibility(true));
      await client.mutate({
        mutation: addFolderMutation,
        variables: {
          input: { name },
        },
        update: (
          _,
          {
            data: {
              folderManagement: { addFolder },
            },
          }
        ) => {
          const { id, name } = addFolder;
          updateUserFoldersInCache({
            addedFolders: [{ id, name }],
            userId: _get(state, 'userDetails.id', ''),
          });
        },
      });

      dispatch(
        setToastMessage({
          title: `Created folder successfully`,
          status: 'success',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    } catch (e) {
      console.error(e);
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    } finally {
      dispatch(setLoaderVisibility(false));
    }
  };

export const updateFolder = ({ name, id }) => {
  return async (dispatch, getState) => {
    try {
      await client.mutate({
        mutation: updateFolderMutation,
        variables: { input: { id, name } },
        optimisticResponse: {
          folderManagement: {
            updateFolder: { id, name, __typename: 'Folder' },
            __typename: 'FolderMutations',
          },
        },
      });

      dispatch(
        setToastMessage({
          title: `Updated folder successfully`,
          status: 'success',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    } catch (e) {
      console.error(e);
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    }
  };
};

export const deleteFolder = ({ id }) => {
  return async (dispatch, getState) => {
    const state = getState();
    const userId = _get(state, 'userDetails.id', '');
    dispatch(setLoaderVisibility(true));
    try {
      await client.mutate({
        mutation: deleteFolderMutation,
        variables: { input: { id } },
        update: (_, { data }) => {
          const id = _get(data, 'folderManagement.deleteFolder.id', '');
          const removedFolders = [id];
          updateUserFoldersInCache({ removedFolders, userId });
        },
      });

      dispatch(
        setToastMessage({
          title: `Deleted folder successfully`,
          status: 'success',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    } catch (e) {
      console.error(e);
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    } finally {
      dispatch(setLoaderVisibility(false));
    }
  };
};

export const addLinkBasicDetails = ({
  url,
  isCompleted,
  folderId,
  searchText,
}) => {
  return async (dispatch) => {
    try {
      const mutationResponse = await client.mutate({
        mutation: addLinkMutation,
        variables: { input: { url, folderId, isCompleted } },
        update: (
          _,
          {
            data: {
              linkManagement: { addLink },
            },
          }
        ) => {
          const shouldUpdateCache = localSearch({ text: url, searchText }) > -1;

          if (shouldUpdateCache) {
            addLinkInCache({
              folderId,
              linkFilters: {
                isCompleted,
                first: DEFAULT_PAGE_SIZE,
                searchText,
              },
              linkData: addLink,
            });
          }
        },
      });

      const linkId = _get(
        mutationResponse,
        'data.linkManagement.addLink.id',
        null
      );

      dispatch(
        setToastMessage({
          title: 'Added link successfully',
          status: 'success',
          isClosable: true,
          position: 'bottom-left',
        })
      );

      return linkId;
    } catch (e) {
      console.error(e);
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
      return null;
    }
  };
};

export const updateLinkBasicDetails = ({
  linksDetails,
  oldStatus,
  oldFolderId,
  searchText,
}) => {
  return async (dispatch) => {
    const linksToBeRemovedFromCurrentFeed = _pipe(
      (data) => {
        return _filter(data, (link) => {
          const { isCompleted, folderId, url } = link;
          const isStatusFilterPresent = getFieldPresenceStatus(isCompleted);

          const isFolderPresent = getFieldPresenceStatus(folderId);

          const isUrlPresent = getFieldPresenceStatus(url);

          const doesUrlMatchWithSearchText = isUrlPresent
            ? localSearch({ text: url, searchText }) > -1
            : true;

          return (
            isStatusFilterPresent ||
            isFolderPresent ||
            !doesUrlMatchWithSearchText
          );
        });
      },
      (data) => _map(data, ({ id }) => id)
    )(linksDetails);

    const areLinksMovedToAnotherFeed = !_isEmpty(
      linksToBeRemovedFromCurrentFeed
    );

    try {
      await client.mutate({
        mutation: updateLinkMutation,
        variables: {
          input: linksDetails,
        },
        update: () => {
          if (areLinksMovedToAnotherFeed) {
            deleteLinkFromCache({
              folderId: oldFolderId,
              linkFilters: {
                isCompleted: oldStatus,
                first: DEFAULT_PAGE_SIZE,
                searchText,
              },
              linkIds: linksToBeRemovedFromCurrentFeed,
            });
          }
        },
      });

      const toastMessage = 'Links updated successfully';

      dispatch(
        setToastMessage({
          title: toastMessage,
          status: 'success',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    } catch (e) {
      console.error(e);
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    }
  };
};

export const updateLinksMetadata = ({ linksDetails }) => {
  return async (dispatch) => {
    try {
      await client.mutate({
        mutation: updateLinksMetadataMutation,
        variables: { input: linksDetails },
      });
    } catch (e) {
      console.error(e);
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    }
  };
};

export const addLink = ({ url, isCompleted, folderId, searchText }) => {
  return async (dispatch) => {
    dispatch(setLoaderVisibility(true));
    const addedLinkId = await dispatch(
      addLinkBasicDetails({ url, isCompleted, folderId, searchText })
    );
    dispatch(setLoaderVisibility(false));

    if (addedLinkId) {
      dispatch(
        updateLinksMetadata({ linksDetails: [{ url, id: addedLinkId }] })
      );
    }
  };
};

export const updateLink = ({
  linksDetails,
  oldStatus,
  oldFolderId,
  searchText,
}) => {
  return async (dispatch) => {
    const linksWithNewUrl = _filter(linksDetails, ({ url }) => !!url);

    dispatch(setLoaderVisibility(true));
    await dispatch(
      updateLinkBasicDetails({
        linksDetails,
        oldStatus,
        oldFolderId,
        searchText,
      })
    );
    dispatch(setLoaderVisibility(false));

    if (!_isEmpty(linksWithNewUrl)) {
      const updateLinksMetadataPayload = _map(
        linksWithNewUrl,
        ({ id, url }) => ({ id, url })
      );
      dispatch(
        updateLinksMetadata({ linksDetails: updateLinksMetadataPayload })
      );
    }
  };
};

export const deleteLink = ({ isCompleted, folderId, linkIds, searchText }) => {
  return async (dispatch, getState) => {
    const mutationInput = _map(linkIds, (id) => ({ id }));
    const responseLinks = _map(linkIds, (id) => ({ id, __typename: 'Link' }));

    try {
      await client.mutate({
        mutation: deleteLinkMutation,
        variables: { input: mutationInput },
        optimisticResponse: {
          linkManagement: {
            deleteLink: responseLinks,
            __typename: 'LinkMutations',
          },
        },
        update: () => {
          deleteLinkFromCache({
            folderId,
            linkFilters: { isCompleted, first: DEFAULT_PAGE_SIZE, searchText },
            linkIds,
          });
        },
      });
      dispatch(
        setToastMessage({
          title: `Deleted ${
            _size(linkIds) === 1 ? 'link' : 'links'
          } successfully`,
          status: 'success',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    } catch (e) {
      console.error(e);
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    }
  };
};

export const updateUser = ({ input }) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setLoaderVisibility(true));
      const response = await client.mutate({
        mutation: updateUserMutation,
        variables: { input },
      });
      dispatch(
        setToastMessage({
          title: 'User details updated successfully',
          status: 'success',
          isClosable: true,
          position: 'bottom-left',
        })
      );

      const newUserDetails = _get(
        response,
        'data.userManagement.updateUser',
        {}
      );
      const userDetails = getState().userDetails;

      const updatedUserDetails = { ...userDetails, ...newUserDetails };

      dispatch(setUserDetails(updatedUserDetails));

      setUserInfoInStorage({ userInfo: updatedUserDetails });
    } catch (e) {
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
      throw e;
    } finally {
      dispatch(setLoaderVisibility(false));
    }
  };
};

export const loginUser = (data, successCallback) => {
  return async (dispatch, getState) => {
    let responseData = {};

    let res = {};
    try {
      dispatch(setLoaderVisibility(true));

      res = await fetch(`${origin}/login`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        referrerPolicy: 'no-referrer',
      });

      responseData = await res.json();

      const { message, showResetPasswordFlow, ...userInfo } = responseData;
      if (res.ok) {
        if (showResetPasswordFlow) {
          dispatch(setUserDetails(userInfo));
        } else {
          setUserInfoInStorage({ userInfo });
          dispatch(setUserDetails(userInfo));
          dispatch(updateUserLoggedInStatus(true));
        }
        successCallback && successCallback({ showResetPasswordFlow });
      } else {
        dispatch(
          setToastMessage({
            title: message || res.statusText,
            status: 'error',
            isClosable: true,
            position: 'bottom-left',
          })
        );
      }
    } catch (e) {
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    } finally {
      dispatch(setLoaderVisibility(false));
    }
  };
};

export const registerUser = (data, successCallback) => {
  return async (dispatch) => {
    let responseData = {};

    let res = {};

    try {
      dispatch(setLoaderVisibility(true));

      res = await fetch(`${origin}/signup`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        referrerPolicy: 'no-referrer',
      });

      /**
       * If res status is ok(status is 200) then we will do redirection
       */
      if (res.ok) {
        successCallback && successCallback();
      } else {
        /**
         * Fetch api throws error only when network error occur.
         * For status 4xx and 5xx, we have to add logic for toast in try block
         */
        responseData = await res.json();

        const { message } = responseData;

        /**
         * If there is message from backend then we will use it otherwise we use
         * default failure message from res obj.
         */
        dispatch(
          setToastMessage({
            title: message || res.statusText,
            status: 'error',
            isClosable: true,
            position: 'bottom-left',
          })
        );
      }
    } catch (e) {
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    } finally {
      dispatch(setLoaderVisibility(false));
    }
  };
};

export const resetPassword = (data, successCallback) => {
  return async (dispatch) => {
    let response = {};

    try {
      dispatch(setLoaderVisibility(true));

      response = await getRequestPromise({ route: 'reset-password', data });

      if (!response.ok) {
        const responseData = await response.json();

        dispatch(
          setToastMessage({
            title: responseData.message || response.statusText,
            status: 'error',
            isClosable: true,
            position: 'bottom-left',
          })
        );
      } else {
        successCallback && successCallback();
      }
    } catch (e) {
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    } finally {
      dispatch(setLoaderVisibility(false));
    }
  };
};

export const changePassword = (data, successCallback) => {
  return async (dispatch) => {
    try {
      dispatch(setLoaderVisibility(true));
      const response = await getRequestPromise({
        route: 'change-password',
        data,
      });

      const responseData = await response.json();

      if (response.ok) {
        setUserInfoInStorage({ userInfo: responseData });
        dispatch(setUserDetails({ userInfo: responseData }));
        dispatch(updateUserLoggedInStatus(true));
        successCallback && successCallback();
      } else {
        dispatch(
          setToastMessage({
            title: responseData.message || response.statusText,
            status: 'error',
            isClosable: true,
            position: 'bottom-left',
          })
        );
      }
    } catch (e) {
      dispatch(
        setToastMessage({
          title: 'Something went wrong',
          status: 'error',
          isClosable: true,
          position: 'bottom-left',
        })
      );
    } finally {
      dispatch(setLoaderVisibility(false));
    }
  };
};

const reducerHandlers = {
  [SET_LOADER_VISIBILITY]: (state, action) => {
    const { payload } = action;
    return { ...state, showLoader: payload };
  },
  [UPDATE_USER_LOGGED_IN_STATUS]: (state, action) => {
    const { payload } = action;
    return { ...state, isUserLoggedIn: payload };
  },
  [SET_USER_DETAILS]: (state, action) => {
    const { payload } = action;
    return { ...state, userDetails: payload };
  },
  [SET_TOAST_MESSAGE]: (state, action) => {
    const { payload } = action;
    return { ...state, toastMessage: payload };
  },
};

const initialState = {
  showLoader: false,
  isUserLoggedIn: false,
  userDetails: {},
  toastMessage: {},
};

const reducer = (state, action) => {
  const type = action.type;
  const stateHandler = reducerHandlers[type];
  return stateHandler?.(state, action) ?? initialState;
};

export default reducer;
