import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from "@apollo/client/utilities";
import {Definintion} from "./apollo_client";
import {SPRING_SERVER_ENDPOINT, SPRING_SERVER_SUBSCRIPTIONS_ENDPOINT} from "./requests";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const springServerHost = process.env.NEXT_PUBLIC_SPRING_SERVER_HOST || null;
const springServerEndpoint = springServerHost ? "http://" + springServerHost + "/graphql" : SPRING_SERVER_ENDPOINT;
const springServerSubscriptionsEndpoint = springServerHost ? "ws://" + springServerHost + "/subscriptions" : SPRING_SERVER_SUBSCRIPTIONS_ENDPOINT;


const httpLink = new HttpLink({
    uri: springServerEndpoint,
});

const wsLink = (process.browser && !process.env.NEXT_PUBLIC_LOCAL) ? new GraphQLWsLink(createClient({
    url: springServerSubscriptionsEndpoint,
    shouldRetry: () => true
})) : null;

const link = (process.browser && !process.env.NEXT_PUBLIC_LOCAL) ? split(
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