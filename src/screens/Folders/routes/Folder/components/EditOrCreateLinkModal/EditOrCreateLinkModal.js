/**--external-- */
import React from 'react';
import { Button } from '@chakra-ui/react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';

/**--internal-- */
import { Modal, Form } from '#components';
import { addLink, updateLink } from '#modules/Module';
import { getLinkDetailsFromCache } from '#modules/GraphqlHelpers';
import { compose } from '#Utils';
import { getUserFoldersEnhancer } from '#modules/QueryEnhancer';

/**--relative */
import classes from './EditOrCreateLinkModal.module.scss';
import { formFields, getDynamicFormFields } from './utils';

const EditOrCreateLink = (props) => {
  const {
    closeModal,
    addLink,
    folderId,
    linkDetails,
    mode,
    linkId,
    updateLink,
    folders,
    defaultLinkStatus,
    linkAddedOrUpdatedCallback,
    searchText,
  } = props;

  const dynamicFormFields = getDynamicFormFields({
    formFields,
    data: {
      isCompleted: defaultLinkStatus,
      ...linkDetails,
      options: folders,
      folderId,
    },
  });

  const getUpdatedLinkData = ({
    link,
    isCompleted: updatedStatus,
    folderId: updatedFolderId,
  }) => {
    const linkData = { id: linkId };

    const isLinkUrlUpdated = link !== linkDetails.url;
    const isLinkStatusUpdated = updatedStatus !== linkDetails.isCompleted;
    const isFolderUpdated = updatedFolderId !== folderId;

    if (isLinkUrlUpdated) {
      linkData.url = link;
    }

    if (isLinkStatusUpdated) {
      linkData.isCompleted = updatedStatus;
    }

    if (isFolderUpdated) {
      linkData.folderId = updatedFolderId;
    }

    return linkData;
  };

  const onSubmit = async ({
    link,
    isCompleted = false,
    folderId: updatedFolderId,
  }) => {
    if (mode === 'CREATE') {
      const createLinkPayload = {
        url: link,
        isCompleted,
        folderId,
        searchText,
      };

      await addLink(createLinkPayload);

      linkAddedOrUpdatedCallback &&
        linkAddedOrUpdatedCallback(createLinkPayload);
    } else {
      const updatedLinkDetails = getUpdatedLinkData({
        link,
        isCompleted,
        folderId: updatedFolderId,
      });

      await updateLink({
        linksDetails: [updatedLinkDetails],
        oldStatus: linkDetails.isCompleted,
        oldFolderId: folderId,
        searchText,
      });

      linkAddedOrUpdatedCallback &&
        linkAddedOrUpdatedCallback(updatedLinkDetails);
    }

    closeModal();
  };

  return (
    <Form
      fields={dynamicFormFields}
      onSubmit={onSubmit}
      formButtonsElement={
        <div className={classes.footer}>
          <Button type="submit" colorScheme="blue">
            {mode === 'CREATE' ? 'Add link' : 'Update link'}
          </Button>
        </div>
      }
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const { linkId } = ownProps;

  const linkDetails = getLinkDetailsFromCache({ linkId });
  const mode = _isEmpty(linkDetails) ? 'CREATE' : 'EDIT';
  const userId = _get(state, 'userDetails.id', '');
  return { mode, linkDetails, userId };
};

const mapActionCreators = {
  addLink,
  updateLink,
};

const EnhancedEditOrCreateLink = compose(
  connect(mapStateToProps, mapActionCreators),
  getUserFoldersEnhancer()
)(EditOrCreateLink);

const EditOrCreateLinkModal = (props) => {
  const {
    closeModal,
    folderId,
    linkId,
    defaultLinkStatus,
    linkAddedOrUpdatedCallback,
    searchText,
  } = props;

  return (
    <Modal onClickOutside={closeModal}>
      <div className={classes.container}>
        <EnhancedEditOrCreateLink
          closeModal={closeModal}
          folderId={folderId}
          linkId={linkId}
          defaultLinkStatus={defaultLinkStatus}
          linkAddedOrUpdatedCallback={linkAddedOrUpdatedCallback}
          searchText={searchText}
        />
      </div>
    </Modal>
  );
};

EditOrCreateLinkModal.displayName = 'EditOrCreateLinkModal';

export default EditOrCreateLinkModal;
