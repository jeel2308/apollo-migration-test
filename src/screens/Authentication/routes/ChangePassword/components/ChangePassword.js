/**--external-- */
import React from 'react';
import { connect } from 'react-redux';
import _get from 'lodash/get';
import { useNavigate } from 'react-router-dom';

/**--internal-- */
import { AuthenticationPage } from '#components';
import { changePassword } from '#modules/Module';

/**--relative-- */
import { formFields } from './ChangePasswordUtils';

const ChangePassword = (props) => {
  const { userId, changePassword } = props;

  const navigate = useNavigate();

  const onChangePassword = () => {
    navigate('/folders');
  };

  const onSubmit = (data) => {
    changePassword({ ...data, id: userId }, onChangePassword);
  };

  return (
    <AuthenticationPage
      formFields={formFields}
      submitButtonText="Change password"
      linkButtonText="Sign in"
      linkButtonHref="/login"
      onSubmit={onSubmit}
      headingText="Change password"
    />
  );
};

const mapStateToProps = (state) => {
  const userId = _get(state, 'userDetails.id', null);
  return { userId };
};

const mapActionCreators = {
  changePassword,
};

export default connect(mapStateToProps, mapActionCreators)(ChangePassword);

ChangePassword.displayName = 'ChangePassword';
