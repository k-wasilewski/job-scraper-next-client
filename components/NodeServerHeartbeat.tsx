import React, {useEffect} from 'react';
import {useSubscription} from "@apollo/client";
import {gql} from "@apollo/client";
import CardHOC from './CardHOC';
import { setJob } from "../redux/slices";
import { useDispatch } from "react-redux";

// @ts-ignore
export const SUBSCRIBE_TO_NEWS = gql`
  subscription Subscription {
      newJobs {
        timestamp,
        link  
      }
    }
`;

export default function NodeServerHeartbeat({ cardClassName }) {
    const { data, loading } = useSubscription(
        SUBSCRIBE_TO_NEWS
    );

    const dispatch = useDispatch();

    useEffect(() => {
      !loading && data && data.newJobs && data.newJobs.link && dispatch(setJob(data.newJobs.link));
    }, [data]);

    const subscription_data = (
        loading ?
            <div className='spinner-border mx-auto '/>
            :
            data ?
                <h5>
                    {data.newJobs.link}
                </h5>
                :
                null
    );

    return (
      <CardHOC 
        title={<h5>Latest new job discovered:</h5>}
        className={cardClassName}
        body={<small className='d-flex text-muted'>{subscription_data}</small>} 
      />
    );
};