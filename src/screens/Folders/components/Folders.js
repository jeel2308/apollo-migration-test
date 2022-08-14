/**--external-- */
import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';
import _size from 'lodash/size';
import { Avatar, Button } from '@chakra-ui/react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { IconContext } from 'react-icons';

/**--internal-- */
import { compose, getMatchingResults, clearStorage } from '#Utils';
import { Sidebar, Dropdown } from '#components';
import { getUserFoldersEnhancer } from '#modules/QueryEnhancer';

/**--relative-- */
import classes from './Folders.module.scss';
import Search from './Search';
import EditOrCreateFolderModal from './EditOrCreateFolderModal';
import DeleteWarningModal from './DeleteWarningModal';
import { loadingContainerStyle, dotsStyle } from './FoldersStyles';
import { USER_ACTIONS, getNextAvailableFolderId } from './FoldersUtils';

const Resources = (props) => {
  const { folders, userBasicDetails } = props;

  const [searchValue, setSearchValue] = useState('');

  const [showEditOrCreateFolderModal, setShowEditOrCreateFolderModal] =
    useState(false);

  const totalFolders = _size(folders);

  const totalFoldersRef = useRef(totalFolders);

  const params = useParams();

  const [showDeleteWarningModal, setShowDeleteWarningModal] = useState(false);

  const [folderId, setFolderId] = useState(null);

  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedFolderId) {
      navigate(`${selectedFolderId}`);
    }
  }, [selectedFolderId]);

  /**
   * This effect will update state on initial mound and
   * when first folder is created
   */
  useEffect(() => {
    if (!selectedFolderId) {
      const folderId = params.folderId ? params.folderId : folders[0]?.id;
      setSelectedFolderId(folderId);
    } else if (totalFolders === 1 && totalFoldersRef.current === 0) {
      setSelectedFolderId(folders[0].id);
    }
  }, [totalFolders]);

  useEffect(() => {
    totalFoldersRef.current = totalFolders;
  }, [totalFolders]);

  const closeEditOrCreateFolderModal = useCallback(() => {
    setShowEditOrCreateFolderModal(false);
    setFolderId(null);
  }, []);

  const closeDeleteWarningModal = useCallback(() => {
    setShowDeleteWarningModal(false);
    setFolderId(null);
  }, []);

  const deleteFolderCallback = ({ folderId: deletedFolderId }) => {
    if (deletedFolderId === selectedFolderId) {
      const nextFolderId = getNextAvailableFolderId({ folderId, folders });

      if (nextFolderId) {
        setSelectedFolderId(nextFolderId);
      } else {
        navigate('../folders', { replace: true });
      }
    }
  };

  const matchingFolders = getMatchingResults({
    list: folders,
    field: 'label',
    searchText: searchValue,
  });

  const selectedFolder = useMemo(() => {
    return _find(folders, ({ id }) => id === selectedFolderId);
  }, [selectedFolderId, folders]);

  const handleAction = ({ data, type }) => {
    switch (type) {
      case 'EDIT': {
        setFolderId(data.id);
        setShowEditOrCreateFolderModal(true);
        break;
      }
      case 'DELETE': {
        setFolderId(data.id);
        setShowDeleteWarningModal(true);
        break;
      }
      default: {
        return;
      }
    }
  };

  const handleUserActions = ({ value }) => {
    switch (value) {
      case 'CREATE': {
        setShowEditOrCreateFolderModal(true);
        break;
      }
      case 'LOGOUT': {
        clearStorage();
        window.location.href = '/';
        break;
      }
      default: {
        return;
      }
    }
  };

  const onAvatarClick = () => {
    navigate('/profile');
  };

  const { name } = userBasicDetails;

  return (
    <div className={classes.container}>
      <div className={classes.leftContainer}>
        <div className={classes.header}>
          <Button variant="link" onClick={onAvatarClick}>
            <Avatar name={name} size="sm" />
          </Button>
          <Dropdown
            variant="unstyled"
            options={USER_ACTIONS}
            dropdownButtonType="icon"
            handleActions={handleUserActions}
            icon={
              <IconContext.Provider value={dotsStyle}>
                <BiDotsVerticalRounded />
              </IconContext.Provider>
            }
          />
        </div>
        {!_isEmpty(folders) && (
          <div className={classes.searchContainer}>
            <Search value={searchValue} onChange={setSearchValue} />
          </div>
        )}
        <div className={classes.sidebarContainer}>
          {!_isEmpty(matchingFolders) ? (
            <Sidebar
              activeOption={selectedFolderId}
              sidebarOptions={matchingFolders}
              onClickOption={({ id }) => setSelectedFolderId(id)}
              handleAction={handleAction}
            />
          ) : !_isEmpty(searchValue) ? (
            <div className={classes.noMatchText}>{'No match found'}</div>
          ) : null}
        </div>
      </div>
      <Outlet context={selectedFolder} />
      {showEditOrCreateFolderModal && (
        <EditOrCreateFolderModal
          closeModal={closeEditOrCreateFolderModal}
          folderId={folderId}
        />
      )}
      {showDeleteWarningModal && (
        <DeleteWarningModal
          closeModal={closeDeleteWarningModal}
          folderId={folderId}
          deleteFolderCallback={deleteFolderCallback}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  const userDetails = state.userDetails;
  return { userId: userDetails.id };
};

export default compose(
  connect(mapStateToProps),
  getUserFoldersEnhancer({ loadingContainerStyle })
)(Resources);

Resources.displayName = 'Resources';
