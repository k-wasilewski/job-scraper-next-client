import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import {configure, mount, ReactWrapper} from 'enzyme';
import Adapter from "@cfaester/enzyme-adapter-react-18";
import NodeServerHeartbeat from "../components/NodeServerHeartbeat";
import { gql } from "@apollo/client";
import { ClientStoreProvider } from "../components/ClientStoreProvider";
import CardHOC from "../components/CardHOC";
import * as reactRedux from "react-redux";
import { SUBSCRIBE_TO_NEWS } from "../components/NodeServerHeartbeat";
import * as slices from "../redux/slices";
import { act } from 'react-dom/test-utils';

const mockTimestamp = '31-01-2024T16:16:16';
const mockLink = 'http://myjobhost.com/job-offer';
const mocks = [
    {
        request: {
          query: SUBSCRIBE_TO_NEWS,
        },
        result: {
          data: {
            newJobs: { timestamp: mockTimestamp, link: mockLink }
          }
        }
      }
];

describe('NodeServerHeartbeat spec', () => {
    let wrapper: ReactWrapper;
    const originalError = console.error;

    beforeAll(() => {
      console.error = (...args: any[]) => {
        if (/Warning.*not wrapped in act/.test(args[0])) {
          return;
        }

        originalError.call(console, ...args);
      };
    });

    afterAll(() => {
      console.error = originalError;
    });

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
                    <NodeServerHeartbeat cardClassName={''} />
                </MockedProvider>
            </ClientStoreProvider>
        );

        expect(wrapper.exists('.spinner-border')).toBeTruthy();
    });

    it('dispatches a job if new job is present in received data', (done) => {
      wrapper = mount(
          <ClientStoreProvider>
              <MockedProvider mocks={mocks}>
                  <NodeServerHeartbeat cardClassName={''} />
              </MockedProvider>
          </ClientStoreProvider>
      );

      const mockDispatch = jest.fn();
      jest.spyOn(reactRedux, "useDispatch").mockReturnValue(mockDispatch);
      const setJobSpy = jest.spyOn(slices, 'setJob');

      setTimeout(() => {
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(setJobSpy).toHaveBeenCalledWith(mockLink);
        done();
      }, 500);
  });

  it('renders job timestamp and link if new job is present in received data', (done) => {
    wrapper = mount(
        <ClientStoreProvider>
            <MockedProvider mocks={mocks}>
                <NodeServerHeartbeat cardClassName={''} />
            </MockedProvider>
        </ClientStoreProvider>
    );

    setTimeout(() => {
      expect(wrapper.text()).toContain(mockLink);
      done();
    }, 500);
  });
});