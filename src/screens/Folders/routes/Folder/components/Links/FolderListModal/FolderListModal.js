/**--external-- */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import _get from 'lodash/get';
import _map from 'lodash/map';
import _filter from 'lodash/filter';
import {
  Heading,
  RadioGroup,
  Radio,
  Stack,
  ButtonGroup,
  Button,
} from '@chakra-ui/react';

/**--internal-- */
import { Modal } from '#components';
import { compose } from '#Utils';
import { getUserFoldersEnhancer } from '#modules/QueryEnhancer';

/**--relative-- */
import classes from './FolderListModal.module.scss';

const FolderList = (props) => {
  const { folders, closeModal, currentFolderId, onUpdateFolder } = props;

  const [selectedFolder, setSelectedFolder] = useState(false);

  const filteredFolders = _filter(folders, ({ id }) => id !== currentFolderId);

  return (
    <div className={classes.folderListContainer}>
      <Heading as="h4" size="md">
        Select Folder
      </Heading>
      <RadioGroup onChange={setSelectedFolder} value={selectedFolder} mt={4}>
        <Stack direction="column" spacing="1">
          {_map(filteredFolders, (folder) => {
            return (
              <Radio
                size="lg"
                value={folder.id}
                display="flex"
                minWidth={0}
                key={folder.id}
              >
                <div className={classes.folderLabel}>{folder.label}</div>
              </Radio>
            );
          })}
        </Stack>
      </RadioGroup>
      <ButtonGroup display="flex" justifyContent="space-between" mt={4}>
        <Button variant="unstyled" onClick={closeModal}>
          Cancel
        </Button>
        <Button
          colorScheme="blue"
          disabled={!selectedFolder}
          onClick={() => onUpdateFolder({ folderId: selectedFolder })}
        >
          Update folder
        </Button>
      </ButtonGroup>
    </div>
  );
};

const mapStateToProps = (state) => {
  const userId = _get(state, 'userDetails.id', '');
  return { userId };
};

const EnhancedFolderList = compose(
  connect(mapStateToProps),
  getUserFoldersEnhancer()
)(FolderList);

const FolderListModal = (props) => {
  const { closeModal, currentFolderId, onUpdateFolder } = props;
  return (
    <Modal onClickOutside={closeModal}>
      <div className={classes.container}>
        <EnhancedFolderList
          closeModal={closeModal}
          currentFolderId={currentFolderId}
          onUpdateFolder={onUpdateFolder}
        />
      </div>
    </Modal>
  );
};

export default FolderListModal;
