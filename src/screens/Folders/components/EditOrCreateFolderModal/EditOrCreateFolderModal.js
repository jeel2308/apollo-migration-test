/**--external-- */
import React from 'react';
import { Button } from '@chakra-ui/react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';

/**--internal-- */
import { Modal, Form } from '#components';
import { addFolder, updateFolder } from '#modules/Module';
import { getFolderBasicDetailsFromCache } from '#modules/GraphqlHelpers';

/**--relative-- */
import { formFields, getDynamicFormFields } from './utils';
import classes from './EditOrCreateFolderModal.module.scss';
const EditOrCreateFolderModal = (props) => {
  const { addFolder, closeModal, folderDetails, mode, updateFolder } = props;

  const onSubmit = (data) => {
    if (mode === 'CREATE') {
      addFolder({ name: data.folder });
    } else {
      updateFolder({ name: data.folder, id: folderDetails.id });
    }

    closeModal();
  };

  const dynamicFormFields = getDynamicFormFields({
    formFields,
    data: folderDetails,
  });

  return (
    <Modal onClickOutside={closeModal}>
      <div className={classes.container}>
        <Form
          fields={dynamicFormFields}
          onSubmit={onSubmit}
          formButtonsElement={
            <div className={classes.footer}>
              <Button colorScheme={'blue'} type={'submit'}>{`${
                mode === 'CREATE' ? 'Create' : 'Update'
              } folder`}</Button>
            </div>
          }
        />
      </div>
    </Modal>
  );
};

const mapStateToProps = (_, ownProps) => {
  const { folderId } = ownProps;
  const folderDetails = getFolderBasicDetailsFromCache({ folderId });
  const mode = _isEmpty(folderDetails) ? 'CREATE' : 'UPDATE';
  return { folderDetails, mode };
};

const mapActionCreators = {
  addFolder,
  updateFolder,
};

export default connect(
  mapStateToProps,
  mapActionCreators
)(EditOrCreateFolderModal);

EditOrCreateFolderModal.displayName = 'EditOrCreateFolderModal';
