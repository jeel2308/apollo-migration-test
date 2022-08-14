/**--external-- */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiChevronLeft } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import { Button, Avatar, Input, Text, ButtonGroup } from '@chakra-ui/react';
import { connect } from 'react-redux';
import { get as _get } from 'lodash';

/**--internal-- */
import { updateUser } from '#modules/Module';

/**--relative-- */
import classes from './Profile.module.scss';
import { backIconStyle } from './ProfileStyles';

const VIEW_MODE = 'VIEW';

const EDIT_MODE = 'EDIT';

const Profile = (props) => {
  const [mode, setMode] = useState(VIEW_MODE);

  const { name, email, updateUser, id } = props;

  const [nameLocal, setNameLocal] = useState('');

  const [emailLocal, setEmailLocal] = useState('');

  useEffect(() => {
    setNameLocal(name);
    setEmailLocal(email);
  }, [name, email]);

  const navigate = useNavigate();

  const onBackButtonClick = () => {
    navigate(-1);
  };

  const onEditClick = () => {
    setMode(EDIT_MODE);
  };

  const onCancelClick = () => {
    setMode(VIEW_MODE);
    setEmailLocal(email);
    setNameLocal(name);
  };

  const onSaveClick = async () => {
    setMode(VIEW_MODE);
    try {
      await updateUser({ input: { name: nameLocal, email: emailLocal, id } });
      setMode(VIEW_MODE);
    } catch (e) {
      console.error(e);
    }
  };

  const onNameChange = (e) => {
    setNameLocal(e.target.value);
  };

  const onEmailChange = (e) => {
    setEmailLocal(e.target.value);
  };

  const renderActionButtonsElement = () => {
    if (mode === VIEW_MODE) {
      return (
        <Button colorScheme="blue" onClick={onEditClick}>
          Edit
        </Button>
      );
    }

    return (
      <>
        <Button variant={'outline'} colorScheme="blue" onClick={onCancelClick}>
          Cancel
        </Button>
        <Button colorScheme="blue" onClick={onSaveClick}>
          Save
        </Button>
      </>
    );
  };

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <Button variant="link" onClick={onBackButtonClick} color="black">
          <IconContext.Provider value={backIconStyle}>
            <BiChevronLeft />
          </IconContext.Provider>
          Back
        </Button>
        <ButtonGroup spacing={'3'}>{renderActionButtonsElement()}</ButtonGroup>
      </header>

      <main className={classes.userDetailsContainer}>
        <Avatar name={nameLocal} size="2xl" />
        <div className={classes.userDetails}>
          <div className={classes.userDetailsItem}>
            <Text mb="3">Name</Text>
            <Input
              value={nameLocal}
              disabled={mode === VIEW_MODE}
              borderColor="black"
              color="black"
              onChange={onNameChange}
            />
          </div>
          <div className={classes.userDetailsItem}>
            <Text mb="3">Email</Text>
            <Input
              value={emailLocal}
              disabled={mode === VIEW_MODE}
              borderColor="black"
              color="black"
              onChange={onEmailChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const mapStateToProps = (state) => {
  const userDetails = _get(state, 'userDetails', {});
  return {
    name: userDetails.name,
    email: userDetails.email,
    id: userDetails.id,
  };
};

const mapActionCreators = { updateUser };

export default connect(mapStateToProps, mapActionCreators)(Profile);

Profile.displayName = 'Profile';
