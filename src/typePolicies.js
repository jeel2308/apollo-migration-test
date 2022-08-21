export const typePolicies = {
  Folder: {
    fields: {
      linksV2: {
        keyArgs: (args) => {
          const { input } = args;
          const variables = Object.keys(input);
          return variables.filter((variable) => variable !== 'after');
        },
        merge: (existing = {}, incoming = {}) => {
          const totalCount = (existing.totalCount || 0) + incoming.totalCount;
          const pageInfo = incoming.pageInfo;
          const edges = [...(existing.edges || []), ...incoming.edges];
          return { totalCount, pageInfo, edges };
        },
      },
    },
  },
};
