import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import {NODE_SERVER_ENDPOINT, NODE_SERVER_SUBSCRIPTIONS_ENDPOINT} from "./requests";

const nodeServerHost = process.env.NEXT_PUBLIC_NODE_SERVER_HOST || null;
const nodeServerEndpoint = nodeServerHost ? "http://" + nodeServerHost + "/graphql" : NODE_SERVER_ENDPOINT;
const nodeServerSubscriptionsEndpoint = nodeServerHost ? "ws://" + nodeServerHost + "/subscriptions" : NODE_SERVER_SUBSCRIPTIONS_ENDPOINT;

export interface Definintion {
    kind: string;
    operation?: string;
};

const httpLink = new HttpLink({
    uri: nodeServerEndpoint,
    credentials: 'include'
});

const wsLink = (process.browser && !process.env.NEXT_PUBLIC_LOCAL) ? new WebSocketLink({
    uri: nodeServerSubscriptionsEndpoint,
    options: {
        reconnect: true
    },
}) : null;

const link = (process.browser && !process.env.NEXT_PUBLIC_LOCAL) ? split(
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