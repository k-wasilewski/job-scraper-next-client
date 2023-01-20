import React from 'react';
import {useSubscription} from "@apollo/client";
import {gql} from "@apollo/client";
import CardHOC from './CardHOC';

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
      <CardHOC 
        title={<h5>Latest new job discovered:</h5>} 
        body={<small className='text-muted'>{subscription_data}</small>} 
      />
    );
};