/**--external-- */
import React from 'react';
import { Heading, Text, ButtonGroup, Button } from '@chakra-ui/react';
import propTypes from 'prop-types';

/**--internal-- */
import { Modal } from '#components';

/**--relative-- */
import classes from './DeleteLinkModal.module.scss';

const DeleteLinkModal = (props) => {
  const { onDeleteClick, onCancelClick, totalLinks } = props;

  return (
    <Modal onClickOutside={onCancelClick}>
      <div className={classes.container}>
        <Heading as={'h3'} fontSize={'xl'}>
          {`Delete ${totalLinks === 1 ? 'link' : 'links'}`}
        </Heading>

        <Text mt={'4'}>
          {`Are you sure you want to delete ${
            totalLinks === 1 ? 'this link' : 'these links'
          }?`}
        </Text>
        <ButtonGroup mt={'10'} display={'flex'} justifyContent={'flex-end'}>
          <Button onClick={onCancelClick}>Cancel</Button>
          <Button colorScheme={'red'} onClick={onDeleteClick}>
            Delete
          </Button>
        </ButtonGroup>
      </div>
    </Modal>
  );
};

export default DeleteLinkModal;

DeleteLinkModal.displayName = 'DeleteLinkModal';

DeleteLinkModal.propTypes = {
  onDeleteClick: propTypes.func,
  onCancelClick: propTypes.func,
  totalLinks: propTypes.number,
};
