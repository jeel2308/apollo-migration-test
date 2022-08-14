/**--external-- */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

/**--internal-- */
import { AuthenticationPage } from '#components';
import { resetPassword } from '#modules/Module';

/**--relative-- */
import { formFields } from './ResetPasswordUtils';
import classes from './ResetPassword.module.scss';

const ResetPassword = (props) => {
  const { resetPassword } = props;

  const [showResetPasswordForm, setShowResetPasswordForm] = useState(true);

  const navigate = useNavigate();

  const hideResetPasswordForm = () => {
    setShowResetPasswordForm(false);
  };

  const onSubmit = (data) => {
    resetPassword(data, hideResetPasswordForm);
  };

  const onSignInClick = () => {
    navigate('/login');
  };

  return showResetPasswordForm ? (
    <AuthenticationPage
      formFields={formFields}
      submitButtonText="Reset password"
      linkButtonText="Sign in"
      headingText="Reset password"
      linkButtonHref="/login"
      onSubmit={onSubmit}
    />
  ) : (
    <div className={classes.container}>
      <Text>
        We have reset your password. We have sent you an email containing
        temporary password. Sign in with this password and set new password.
      </Text>
      <div className={classes.footer}>
        <Button colorScheme="blue" onClick={onSignInClick}>
          Sign in
        </Button>
      </div>
    </div>
  );
};

const mapActionCreators = {
  resetPassword,
};

export default connect(null, mapActionCreators)(ResetPassword);

ResetPassword.displayName = 'ResetPassword';
