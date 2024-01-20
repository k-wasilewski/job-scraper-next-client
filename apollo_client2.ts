import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from "@apollo/client/utilities";
import {Definintion} from "./apollo_client";
import {SPRING_SERVER_ENDPOINT, SPRING_SERVER_SUBSCRIPTIONS_ENDPOINT} from "./requests";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const springServerHost = publicRuntimeConfig?.nodeServerHost || null;
const springServerEndpoint = springServerHost ? "http://" + springServerHost + "/graphql" : SPRING_SERVER_ENDPOINT;
const springServerSubscriptionsEndpoint = springServerHost ? "http://" + springServerHost + "/subscriptions" : SPRING_SERVER_SUBSCRIPTIONS_ENDPOINT;


const httpLink = new HttpLink({
    uri: springServerEndpoint,
});

const wsLink = process.browser ? new GraphQLWsLink(createClient({
    url: springServerSubscriptionsEndpoint,
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