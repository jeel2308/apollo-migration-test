import Component from './components';

const plainRoutes = {
  /**kebab case won't work here */
  path: ':folderId',
  element: <Component />,
};

export default plainRoutes;
