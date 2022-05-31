import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import {NODE_SERVER_ENDPOINT, NODE_SERVER_SUBSCRIPTIONS_ENDPOINT} from "./requests";

export interface Definintion {
    kind: string;
    operation?: string;
};

const httpLink = new HttpLink({
    uri: NODE_SERVER_ENDPOINT,
    credentials: 'include'
});

const wsLink = process.browser ? new WebSocketLink({
    uri: NODE_SERVER_SUBSCRIPTIONS_ENDPOINT,
    options: {
        reconnect: true
    },
}) : null;

const link = process.browser ? split(
    ({ query }) => {
        const { kind, operation }: Definintion = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
) : httpLink;

const cache = new InMemoryCache();

const client = new ApolloClient({ link, cache, credentials: 'include' });

export default client;