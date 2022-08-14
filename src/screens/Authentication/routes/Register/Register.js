/**--external-- */
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { connect } from 'react-redux';

/**--internal-- */
import { AuthenticationPage } from '#components';
import { registerUser } from '#modules/Module';

/**--relative-- */
import { formFields } from './utils';

const Register = (props) => {
  const { registerUser } = props;
  const navigate = useNavigate();

  const onSubmit = (data) => {
    registerUser(data, () => navigate('/login'));
  };

  return (
    <AuthenticationPage
      headingText="Sign up"
      linkButtonText="Sign in"
      submitButtonText="Sign up"
      formFields={formFields}
      onSubmit={onSubmit}
      linkButtonHref="/login"
    />
  );
};

Register.displayName = 'Register';
const mapActionCreators = {
  registerUser,
};

export default connect(null, mapActionCreators)(Register);
