/**--external-- */
import _size from 'lodash/size';
import _findIndex from 'lodash/findIndex';

export const USER_ACTIONS = [
  { label: 'Create folder', value: 'CREATE' },
  { label: 'Log out', value: 'LOGOUT' },
];

export const getNextAvailableFolderId = ({ folderId, folders }) => {
  const totalFolders = _size(folders);

  if (totalFolders === 1) {
    return null;
  }

  const folderIndex = _findIndex(folders, ({ id }) => id === folderId);

  if (folderIndex !== totalFolders - 1) {
    return folders[folderIndex + 1]?.id;
  }

  return folders[folderIndex - 1]?.id;
};
