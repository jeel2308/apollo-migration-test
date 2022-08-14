/**--external-- */
import React from 'react';
import { connect } from 'react-redux';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

/**--internal-- */
import { AuthenticationPage } from '#components';
import { loginUser } from '#modules/Module';

/**--relative-- */
import { formFields } from './utils';

const origin = process.env.REACT_APP_SERVER_URL;

const Login = (props) => {
  const { loginUser } = props;

  const navigate = useNavigate();

  const onCreateAccountClick = () => {
    navigate('/register');
  };

  const onLoginSuccess = ({ showResetPasswordFlow }) => {
    if (!showResetPasswordFlow) {
      navigate('/folders');
    } else {
      navigate('/changePassword');
    }
  };

  const submitForm = async (data) => {
    loginUser(data, onLoginSuccess);
  };

  return (
    <AuthenticationPage
      formFields={formFields}
      submitButtonText="Sign in"
      linkButtonText="Forgot password"
      headingText="Sign in"
      onSubmit={submitForm}
      linkButtonHref="/resetPassword"
      footerElement={
        <div>
          New to LinkManagement?
          <Button
            variant="link"
            colorScheme="blue"
            ml="1"
            onClick={onCreateAccountClick}
          >
            Create account
          </Button>
        </div>
      }
    />
  );
};

const mapActionCreators = {
  loginUser,
};

export default connect(null, mapActionCreators)(Login);
Login.displayName = 'Login';
