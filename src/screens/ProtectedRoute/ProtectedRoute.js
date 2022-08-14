/**--external-- */
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

const ProtectedRoute = (props) => {
  const navigate = useNavigate();

  const { isUserLoggedIn } = props;

  useEffect(() => {
    if (!isUserLoggedIn) {
      navigate('/');
    }
  }, [isUserLoggedIn]);

  return isUserLoggedIn && <Outlet />;
};

const mapStateToProps = (state) => {
  return { isUserLoggedIn: state.isUserLoggedIn };
};

export default connect(mapStateToProps)(ProtectedRoute);

ProtectedRoute.displayName = 'ProtectedRoute';
