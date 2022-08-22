import _ from 'lodash';

export const typePolicies = {
  Folder: {
    fields: {
      linksV2: {
        keyArgs: (args) => {
          const { input } = args;
          const variables = Object.keys(input);
          return [
            'input',
            variables.filter((variable) => variable !== 'after'),
          ];
        },
        merge: (existing = {}, incoming = {}, { readField }) => {
          const totalCount = (existing.totalCount || 0) + incoming.totalCount;
          const pageInfo = incoming.pageInfo;
          const edges = _.uniqBy(
            [...(existing.edges || []), ...incoming.edges],
            ({ node }) => readField('id', node)
          );
          return { totalCount, pageInfo, edges };
        },
      },
    },
  },
};
