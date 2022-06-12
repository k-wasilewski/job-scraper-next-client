import React from 'react';
import {useSubscription} from "@apollo/client";
import {gql} from "@apollo/client";

// @ts-ignore
const SUBSCRIBE_TO_NEWS = gql`
  subscription Subscription {
      newJobs {
        timestamp,
        link  
      }
    }
`;

export default function NodeServerHeartbeat() {
    const { data, loading } = useSubscription(
        SUBSCRIBE_TO_NEWS
    );

    const subscription_data = (
        loading ?
            <h4>Loading...</h4>
            :
            data ?
                <h4>
                    {data.newJobs.link}
                    <br/>
                    {data.newJobs.timestamp}
                    <br/>
                </h4>
                :
                null
    );

    return (
      <>
        <span>Latest new job discovered:</span> {subscription_data}
      </>
    );
};