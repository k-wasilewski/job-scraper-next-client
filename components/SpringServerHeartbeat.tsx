import React from 'react';
import {useSubscription} from "@apollo/client";
import {gql} from "@apollo/client";
import CardHOC from './CardHOC';

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

    const subscription_data = (
        loading ?
            <div className='spinner-border mx-auto'/>
            :
            data ?
                <h4>
                    {data.scrapesPerformed}
                    <br/>
                </h4>
                :
                null
    );

    return (
        <CardHOC 
            title={<h5>Latest scrape performed at:</h5>} 
            body={<small className='d-flex text-muted'>{subscription_data}</small>} 
        />
    );
};