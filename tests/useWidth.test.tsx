import React from "react";
import {configure, mount, ReactWrapper} from 'enzyme';
import Adapter from "@cfaester/enzyme-adapter-react-18";
import { useWidth } from "../utils/useWidth";
import { act } from 'react-dom/test-utils';

const HookWrapper = () => {
    const width = useWidth();

    return (
        <div id='widthDiv'>{width|0}</div>
    );
};

describe('useWidth spec', () => {
    let wrapper: ReactWrapper;

    beforeEach(() => {
        configure({ adapter: new Adapter() });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('returns the value of window.innerWidth reacting dynamically to resize event', async () => {        
        wrapper = mount(<HookWrapper />);
        
        const widthDiv = wrapper.find('#widthDiv');
        const initWidth = widthDiv.text();
        const newWidth = 1000;

        await act(async () => {
            window.innerWidth = newWidth;
            await window.dispatchEvent(new Event('resize'));
        });
        
        expect(widthDiv.text()).not.toEqual(initWidth);
        expect(widthDiv.text()).toEqual(newWidth.toString());
    });
});