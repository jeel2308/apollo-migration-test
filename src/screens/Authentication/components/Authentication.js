/**--external-- */
import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { connect } from 'react-redux';

/**--internal-- */
import { Modal } from '#components';
/**--relative-- */
import { BANNER_URL } from './utils';
import classes from './Authentication.module.scss';

const Authentication = (props) => {
  const { isUserLoggedIn } = props;

  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoggedIn) {
      navigate('/folders');
    }
  }, [isUserLoggedIn]);

  const element = (
    <div className={classes.container}>
      <div className={classes.banner}>
        <figure className={classes.figure}>
          <img src={BANNER_URL} alt="banner" />
        </figure>
      </div>
      <Modal>
        <div className={classes.content}>
          <Outlet />
        </div>
      </Modal>
    </div>
  );

  return !isUserLoggedIn && element;
};

const mapStateToProps = (state) => {
  return {
    isUserLoggedIn: state.isUserLoggedIn,
  };
};

export default connect(mapStateToProps)(Authentication);

Authentication.displayName = 'Authentication';
