/**--external-- */
import { gql } from '@apollo/client';

/**--relative-- */
import { folderFragments } from './Fragments';

export const getUserFoldersQuery = gql`
  query getUserFolders($input: NodeInput!) {
    node(input: $input) {
      ... on User {
        id
        name
        folders {
          ...folderBasicDetailsItem
        }
      }
    }
  }
  ${folderFragments.folderBasicDetails}
`;

export const getFolderDetailsQuery = gql`
  query getFolderDetails(
    $input: NodeInput!
    $linkFilterInputV2: FolderLinkFiltersV2
  ) {
    node(input: $input) {
      ... on Folder {
        ...folderDetailsItem
      }
    }
  }
  ${folderFragments.folderDetails}
`;
