/**--external-- */
import React from 'react';
import PropTypes from 'prop-types';
import { Heading, ButtonGroup, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

/**--relative-- */
import Form from '../Form';
import classes from './AuthenticationPage.module.scss';
import { buttonGroupStyle, linkStyle } from './AuthenticationPageStyles';

const FormButtons = (props) => {
  const { linkButtonText, submitButtonText, linkButtonHref } = props;
  return (
    <ButtonGroup style={buttonGroupStyle}>
      <Link to={linkButtonHref} style={linkStyle}>
        <Button colorScheme={'blue'} variant={'link'}>
          {linkButtonText}
        </Button>
      </Link>
      <Button colorScheme={'blue'} type={'submit'}>
        {submitButtonText}
      </Button>
    </ButtonGroup>
  );
};

FormButtons.propTypes = {
  linkButtonHref: PropTypes.string,
  submitButtonText: PropTypes.string,
  linkButtonText: PropTypes.string,
};

FormButtons.displayName = 'FormButtons';

const AuthenticationPage = (props) => {
  const {
    submitButtonText,
    linkButtonText,
    headingText,
    formFields,
    onSubmit,
    linkButtonHref,
    footerElement,
  } = props;

  return (
    <div className={classes.container}>
      <Heading as="h2" size="lg">
        {headingText}
      </Heading>
      <Form
        fields={formFields}
        onSubmit={onSubmit}
        formButtonsElement={
          <FormButtons
            submitButtonText={submitButtonText}
            linkButtonText={linkButtonText}
            linkButtonHref={linkButtonHref}
          />
        }
      />
      {footerElement}
    </div>
  );
};

export default AuthenticationPage;

AuthenticationPage.propTypes = {
  submitButtonText: PropTypes.string,
  linkButtonText: PropTypes.string,
  headingText: PropTypes.string,
  formFields: PropTypes.array,
  onSubmit: PropTypes.func,
  linkButtonHref: PropTypes.string,
  footerElement: PropTypes.element,
};

AuthenticationPage.defaultProps = {
  footerElement: null,
};

AuthenticationPage.displayName = 'AuthenticationPage';
