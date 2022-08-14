/**--external-- */
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';

/**--relative-- */
import { getToken } from './Utils';
import schema from './fragmentTypes.json';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: schema,
});

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: {
      ...headers,
      authorization: token ? token : '',
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache({
    fragmentMatcher,
    typePolicies: {
      Folder: {
        fields: {
          links: {
            merge: (_, incoming) => {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      /**
       * This is required to avoid network calls when cache is updated
       */
      nextFetchPolicy(lastFetchPolicy) {
        if (
          lastFetchPolicy === 'cache-and-network' ||
          lastFetchPolicy === 'network-only'
        ) {
          return 'cache-first';
        }
        return lastFetchPolicy;
      },
    },
  },
  /**
   * Apollo links will be recalculated for each operation.
   */
  link: authLink.concat(httpLink),
});

export default client;
