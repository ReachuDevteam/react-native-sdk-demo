import {ApolloClient, InMemoryCache, HttpLink, from} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {API_TOKEN, GRAPHQL_SERVER_URL} from '../consts/env';

const httpLink = new HttpLink({
  uri: GRAPHQL_SERVER_URL,
});

const authLink = setContext((_, {headers}) => {
  return {
    headers: {
      ...headers,
      authorization: API_TOKEN,
    },
  };
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
