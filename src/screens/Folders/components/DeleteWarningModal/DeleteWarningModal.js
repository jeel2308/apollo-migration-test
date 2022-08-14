/**--external-- */
import React from 'react';
import { Heading, Text, ButtonGroup, Button } from '@chakra-ui/react';
import { connect } from 'react-redux';

/**--internal-- */
import { Modal } from '#components';
import { deleteFolder } from '#modules/Module';

/**--relative-- */
import classes from './DeleteWarningModal.module.scss';

const DeleteWarningModal = (props) => {
  const { closeModal, deleteFolder, folderId, deleteFolderCallback } = props;

  const onDeleteClick = async () => {
    closeModal();
    await deleteFolder({ id: folderId });
    deleteFolderCallback({ folderId });
  };

  return (
    <Modal onClickOutside={closeModal}>
      <div className={classes.container}>
        <Heading as={'h3'} fontSize={'xl'}>
          Delete Folder
        </Heading>
        <Text mt={'4'}>
          Are you sure you want to delete this folder?You will lose all links
          that belong to this folder
        </Text>
        <ButtonGroup mt={'10'} display={'flex'} justifyContent={'flex-end'}>
          <Button onClick={closeModal}>Cancel</Button>
          <Button colorScheme={'red'} onClick={onDeleteClick}>
            Delete
          </Button>
        </ButtonGroup>
      </div>
    </Modal>
  );
};

const mapActionCreators = {
  deleteFolder,
};

export default connect(null, mapActionCreators)(DeleteWarningModal);

DeleteWarningModal.displayName = 'DeleteWarningModal';
