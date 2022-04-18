import React from 'react';
import {useSubscription} from "@apollo/client";
import {gql} from "@apollo/client";

// @ts-ignore
const SUBSCRIBE_TO_SCRAPES_PERFORMED = gql`
    subscription Subscription {
        scrapesPerformed
    }
`;

export default function SpringServerHeartbeat() {
    const { data, loading } = useSubscription(
        SUBSCRIBE_TO_SCRAPES_PERFORMED
    );

    return loading ?
        <h4>Loading...</h4>
        :
        data ?
            <h4>
                {data.scrapesPerformed}
                <br/>
            </h4>
            :
            null;
};