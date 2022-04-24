import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import {Definintion} from "./apollo_client";
import {SPRING_SERVER_ENDPOINT, SPRING_SERVER_SUBSCRIPTIONS_ENDPOINT} from "./requests";

const httpLink = new HttpLink({
    uri: SPRING_SERVER_ENDPOINT,
});

const wsLink = process.browser ? new WebSocketLink({
    uri: SPRING_SERVER_SUBSCRIPTIONS_ENDPOINT,
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

const client = new ApolloClient({ link, cache });

export default client;