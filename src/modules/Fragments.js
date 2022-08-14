import { gql } from '@apollo/client';

export const linkFragments = {
  linkDetails: gql`
    fragment linkDetailsItem on Link {
      id
      url
      isCompleted
      title
      description
      thumbnail
    }
  `,
};

export const folderFragments = {
  folderBasicDetails: gql`
    fragment folderBasicDetailsItem on Folder {
      id
      name
    }
  `,
  folderDetails: gql`
    fragment folderDetailsItem on Folder {
      id
      name
      linksV2(input: $linkFilterInputV2) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            ...linkDetailsItem
          }
        }
      }
    }
    ${linkFragments.linkDetails}
  `,
};

export const userFragments = {
  userBasicDetails: gql`
    fragment userBasicDetailsItem on User {
      id
      name
      email
    }
  `,
};
