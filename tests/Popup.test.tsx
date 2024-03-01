import React, { useRef } from 'react';
import {configure, mount, ReactWrapper} from 'enzyme';
import { Popup } from '../components/Popup';
import Adapter from "@cfaester/enzyme-adapter-react-18";

describe('Popup spec', () => {
    let wrapper: ReactWrapper;

    beforeEach(() => {
        configure({ adapter: new Adapter() });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders message from prop', () => {
        const messageProp = 'myMessageProp';

        wrapper = mount(<Popup message={messageProp} onClose={() => {}} />);

        const containerNode = wrapper.find('#popup-message-container');

        expect(containerNode.text()).toContain(messageProp);
    });

    it('invokes onClose prop function on escape key press', () => {
        const eventMap = {
            keydown: null,
        };
        window.addEventListener = jest.fn((event, cb) => {
            eventMap[event] = cb;
        });

        const mockOnClose = jest.fn();

        wrapper = mount(<Popup message={''} onClose={mockOnClose} />);

        eventMap.keydown({key: 'Escape'});

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('invokes onClose prop function on an outside click', () => {
        const eventMap = {
            click: null,
        };
        window.addEventListener = jest.fn((event, cb) => {
            eventMap[event] = cb;
        });

        const mockOnClose = jest.fn();

        wrapper = mount(<Popup message={''} onClose={mockOnClose} />);

        eventMap.click({});

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('doesnt invoke onClose prop function on an inside click', () => {
        const eventMap = {
            click: null,
        };
        window.addEventListener = jest.fn((event, cb) => {
            eventMap[event] = cb;
        });

        const mockOnClose = jest.fn();

        const reference = { current: null };
        Object.defineProperty(reference, "current", {
            get: jest.fn(() => ({contains: (a) => !a})),
            set: jest.fn(() => null),
        });

        jest.spyOn(React, "useRef").mockReturnValue(reference);

        wrapper = mount(<Popup message={''} onClose={mockOnClose} />);

        eventMap.click({ target: null });
        
        expect(mockOnClose).not.toHaveBeenCalled();
    });
});