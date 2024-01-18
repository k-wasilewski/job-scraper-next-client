import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from "@apollo/client/utilities";
import {Definintion} from "./apollo_client";
import {SPRING_SERVER_ENDPOINT, SPRING_SERVER_SUBSCRIPTIONS_ENDPOINT} from "./requests";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({
    uri: SPRING_SERVER_ENDPOINT,
});

const wsLink = process.browser ? new GraphQLWsLink(createClient({
    url: SPRING_SERVER_SUBSCRIPTIONS_ENDPOINT,
    shouldRetry: () => true
})) : null;

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