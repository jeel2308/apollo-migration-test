/**--external-- */
import _isEmpty from 'lodash/isEmpty';
import _includes from 'lodash/includes';
import _get from 'lodash/get';
import _map from 'lodash/map';

/**--internal-- */
import { withQuery } from '#components';

/**--relative-- */
import { getUserFoldersQuery } from '#modules/Queries';

export const getUserFoldersEnhancer = (customConfigurations) => {
  return withQuery(getUserFoldersQuery, {
    name: 'getUserFoldersQuery',
    fetchPolicy: 'cache-and-network',
    getVariables: ({ userId }) => ({ input: { id: userId, type: 'USER' } }),
    mapQueryDataToProps: ({ getUserFoldersQuery }) => {
      const { networkStatus, data } = getUserFoldersQuery;

      const isData = !_isEmpty(data);

      const isLoading = _includes([1, 2], networkStatus);

      const { folders, name } = _get(data, 'node', {});

      const folderList = _map(folders, ({ id, name }) => ({ id, label: name }));

      const userBasicDetails = { name };

      return { folders: folderList, isData, isLoading, userBasicDetails };
    },
    ...(customConfigurations ? customConfigurations : {}),
  });
};
