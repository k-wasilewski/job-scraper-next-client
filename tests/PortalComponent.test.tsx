import React from 'react';
import {configure, mount, ReactWrapper} from 'enzyme';
import Adapter from "@cfaester/enzyme-adapter-react-18";
import { PortalComponent } from '../components/PortalComponent';

describe('PortalComponent spec', () => {
    let wrapper: ReactWrapper;

    beforeEach(() => {
        configure({ adapter: new Adapter() });
    });

    afterEach(() => {
        wrapper.unmount();
        document.getElementsByTagName('html')[0].innerHTML = ''; 
    });

    it('renders on client side if render condition is met', () => {
        const renderCondition: boolean = true;
        const rootElementId: string = 'rootElementId';
        const elementId: string = 'elementId';
        const element: JSX.Element = <div id={elementId}/>;
        const origProcess = process;
        global.process = { ...origProcess, browser: true };

        wrapper = mount(
            <PortalComponent 
                renderCondition={renderCondition} 
                rootElementId={rootElementId}
                element={element}    
            />);

        const foundRootElement = document.querySelector(`#${rootElementId}`);
        expect(foundRootElement).not.toBeNull();
        const foundElement = document.querySelector(`#${elementId}`);
        expect(foundElement).not.toBeNull();
    });

    it('doesnt render on client side if render condition is not met', () => {
        const renderCondition: boolean = false;
        const rootElementId: string = 'rootElementId';
        const elementId: string = 'elementId';
        const element: JSX.Element = <div id={elementId}/>;
        const origProcess = process;
        global.process = { ...origProcess, browser: true };

        wrapper = mount(
            <PortalComponent 
                renderCondition={renderCondition} 
                rootElementId={rootElementId}
                element={element}    
            />);

            const foundRootElement = document.querySelector(`#${rootElementId}`);
            expect(foundRootElement).toBeNull();
            const foundElement = document.querySelector(`#${elementId}`);
            expect(foundElement).toBeNull();
    });

    it('doesnt render on server side if render condition is met', () => {
        const renderCondition: boolean = true;
        const rootElementId: string = 'rootElementId';
        const elementId: string = 'elementId';
        const element: JSX.Element = <div id={elementId}/>;
        const origProcess = process;
        global.process = { ...origProcess, browser: false };

        wrapper = mount(
            <PortalComponent 
                renderCondition={renderCondition} 
                rootElementId={rootElementId}
                element={element}    
            />);

        const foundRootElement = document.querySelector(`#${rootElementId}`);
        expect(foundRootElement).toBeNull();
        const foundElement = document.querySelector(`#${elementId}`);
        expect(foundElement).toBeNull();
    });

    it('doesnt render on server side if render condition is not met', () => {
        const renderCondition: boolean = false;
        const rootElementId: string = 'rootElementId';
        const elementId: string = 'elementId';
        const element: JSX.Element = <div id={elementId}/>;
        const origProcess = process;
        global.process = { ...origProcess, browser: false };

        wrapper = mount(
            <PortalComponent 
                renderCondition={renderCondition} 
                rootElementId={rootElementId}
                element={element}    
            />);

        const foundRootElement = document.querySelector(`#${rootElementId}`);
        expect(foundRootElement).toBeNull();
        const foundElement = document.querySelector(`#${elementId}`);
        expect(foundElement).toBeNull();
    });
});