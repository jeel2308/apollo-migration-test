import {
  ApolloClient,
  InMemoryCache,
  concat,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { typePolicies } from './typePolicies';

/**--relative-- */
import { getToken } from './Utils';
import schema from './fragmentTypes.json';

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: getToken(),
    },
  }));

  return forward(operation);
});

const httpLink = new HttpLink({
  uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
});

const cache = new InMemoryCache({
  fragmentMatcher: new IntrospectionFragmentMatcher({
    introspectionQueryResultData: schema,
  }),
  typePolicies,
});

const client = new ApolloClient({
  cache,
  link: concat(authMiddleware, httpLink),
  defaultOptions: {
    watchQuery: {
      nextFetchPolicy: 'cache-only',
    },
  },
});

export default client;
