import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import {configure, mount, ReactWrapper} from 'enzyme';
import Adapter from "@cfaester/enzyme-adapter-react-18";
import NodeServerHeartbeat from "../components/NodeServerHeartbeat";
import { gql } from "@apollo/client";
import { ClientStoreProvider } from "../components/ClientStoreProvider";
import CardHOC from "../components/CardHOC";

const SUBSCRIBE_TO_NEWS = gql`
  subscription Subscription {
      newJobs {
        timestamp,
        link  
      }
    }
`;

const mocks = [
    {
        request: {
          query: SUBSCRIBE_TO_NEWS,
        },
        result: {
          data: {
            newJobs: { timestamp: "31-01-2024T16:16:16", link: 'http://myjobhost.com/job-offer' }
          }
        }
      }
];

describe('NodeServerHeartbeat spec', () => {
    let wrapper: ReactWrapper;

    beforeEach(() => {
        configure({ adapter: new Adapter() });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders a spinner if there is no data', () => {
        wrapper = mount(
            <ClientStoreProvider>
                <MockedProvider mocks={mocks}>
                    <NodeServerHeartbeat />
                </MockedProvider>
            </ClientStoreProvider>
        );

        expect(wrapper.exists('.spinner-border')).toBeTruthy();
    });
});