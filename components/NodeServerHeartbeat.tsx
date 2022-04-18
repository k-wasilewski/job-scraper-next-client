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

    return loading ?
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
            null;
};