import Component from './components';

const plainRoutes = {
  element: <Component />,
  /**
   * index suggests that this is index route.
   * It will be rendered when no child route matches with url.
   */
  index: true,
};

export default plainRoutes;
