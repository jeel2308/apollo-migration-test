import Component from './components';
import {
  loginRoutes,
  registerRoutes,
  ResetPasswordRoutes,
  ChangePasswordRoutes,
} from './routes';

const plainRoutes = {
  element: <Component />,
  children: [
    loginRoutes,
    registerRoutes,
    ResetPasswordRoutes,
    ChangePasswordRoutes,
  ],
};

export default plainRoutes;
