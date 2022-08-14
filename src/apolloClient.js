// import { ApolloClient, createNetworkInterface, IntrospectionFragmentMatcher } from 'react-apollo';
import { ApolloClient } from 'apollo-client-preset';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';

import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
  defaultDataIdFromObject,
} from 'apollo-cache-inmemory';
import schema from './fragmentTypes.json';

/**--relative-- */
import { getToken } from './Utils';

const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: {
      ...headers,
      authorization: token ? token : '',
    },
  };
});

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
});

const cache = new InMemoryCache({
  //resultCaching: false,
  fragmentMatcher: new IntrospectionFragmentMatcher({
    introspectionQueryResultData: schema,
  }),
  dataIdFromObject: (object) => {
    return defaultDataIdFromObject(object); // fall back to default handling
  },
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache,
});

export default client;
