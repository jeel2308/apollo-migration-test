import Component from './components';
import { folderRoutes, noFolderRoutes } from './routes';

const plainRoutes = {
  path: 'folders',
  element: <Component />,
  children: [folderRoutes, noFolderRoutes],
};

export default plainRoutes;
