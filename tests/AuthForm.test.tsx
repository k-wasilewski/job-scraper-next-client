import React from 'react';
import {configure, mount, ReactWrapper} from 'enzyme';
import Adapter from "@cfaester/enzyme-adapter-react-18";
import AuthForm, { AuthFormType } from '../components/AuthForm';
import CardHOC from '../components/CardHOC';
import * as requests from "../requests";
import { AxiosResponse } from 'axios';
import { act } from 'react-dom/test-utils';

const pushMock = jest.fn();
jest.mock('next/router', () => ({
    useRouter() {
      return ({
        push: pushMock,
      });
    },
  }));

describe("AuthForm spec", () => {
    let wrapper: ReactWrapper;
    const originalProcess = process;

    beforeEach(() => {
        global.process = { ...originalProcess, browser: true };
        configure({ adapter: new Adapter() });
    });

    afterEach(() => {
        global.process = originalProcess;
        wrapper.unmount();
    });

    it('renders proper texts if type is \'login\'', () => {
        const loginType: AuthFormType = AuthFormType.Login;

        wrapper = mount(
            <AuthForm type={loginType} />
        );

        const titleNode = wrapper.find(CardHOC).find('div.card-title').first();
        const switchPageBtnNode = wrapper.find('#switchPageBtn').first();
        
        expect(titleNode.text()).toEqual('Log in to job-scraper');
        expect(switchPageBtnNode.text()).toEqual('Register');
    });

    it('renders proper texts if type is \'register\'', () => {
        const registerType: AuthFormType = AuthFormType.Register;

        wrapper = mount(
            <AuthForm type={registerType} />
        );

        const titleNode = wrapper.find(CardHOC).find('div.card-title').first();
        const switchPageBtnNode = wrapper.find('#switchPageBtn').first();
        
        expect(titleNode.text()).toEqual('Register at job-scraper');
        expect(switchPageBtnNode.text()).toEqual('Login');
    });

    it('sends \'login\' request if type is \'login\' and redirects to \'/\' on succesfull resp', async () => {
        const loginType: AuthFormType = AuthFormType.Login;
        const loginSpy = jest.spyOn(requests, 'login')
            .mockImplementation(() => Promise.resolve({ data: { data: { login: { success: true } } }, status: 200 } as AxiosResponse));
        
        wrapper = mount(
            <AuthForm type={loginType} />
        );

        const form = wrapper.find(CardHOC).find('form').first();
        const emailInput = form.find('input[type="email"]').first();
        const passwordInput = form.find('input[type="password"]').first();
        
        await act(async () => {
            await emailInput.simulate('change', { target: { value: 'test@test.com' } });
        });
        await act(async () => {
            await passwordInput.simulate('change', { target: { value: 'mypwd' } });
        });
        await act(async () => {
            await form.simulate('submit');
        });

        await wrapper.update();

        await expect(loginSpy).toHaveBeenCalled();
        await expect(pushMock).toHaveBeenCalledWith('/');
    });

    it('sends \'register\' request if type is \'register\' and redirects to \'/\' on succesfull resp', async () => {
        const registerType: AuthFormType = AuthFormType.Register;
        const registerSpy = jest.spyOn(requests, 'register')
            .mockImplementation(() => Promise.resolve({ data: { data: { register: { success: true } } }, status: 200 } as AxiosResponse));

        wrapper = mount(
            <AuthForm type={registerType} />
        );

        const form = wrapper.find(CardHOC).find('form').first();
        const emailInput = form.find('input[type="email"]').first();
        const passwordInput = form.find('input[type="password"]').first();
        
        await act(async () => {
            await emailInput.simulate('change', { target: { value: 'test@test.com' } });
        });
        await act(async () => {
            await passwordInput.simulate('change', { target: { value: 'mypwd' } });
        });
        await act(async () => {
            await form.simulate('submit');
        });

        await wrapper.update();

        await expect(registerSpy).toHaveBeenCalled();
        await expect(pushMock).toHaveBeenCalledWith('/');
    });

    it('sends \'login\' request if type is \'login\' and renders a popup on unsuccesfull resp', async () => {        
        const popupContainer = document.createElement('div');
        popupContainer.setAttribute('id', 'popup-portal-container');
        document.body.appendChild(popupContainer);
        
        const loginType: AuthFormType = AuthFormType.Login;
        const errorMsg = 'My error message';
        jest.spyOn(requests, 'login')
            .mockImplementation(() => Promise.resolve({ data: { errors: [ { message: errorMsg } ] }, status: 500 } as AxiosResponse));
        
        wrapper = mount(
            <AuthForm type={loginType} />
        );

        const form = wrapper.find(CardHOC).find('form').first();
        const emailInput = form.find('input[type="email"]').first();
        const passwordInput = form.find('input[type="password"]').first();

        expect(document.querySelector('#popup-message-container')).toBeFalsy();
        
        await act(async () => {
            await emailInput.simulate('change', { target: { value: 'test@test.com' } });
        });
        await act(async () => {
            await passwordInput.simulate('change', { target: { value: 'mypwd' } });
        });
        await act(async () => {
            await form.simulate('submit');
        });

        await wrapper.update();

        await expect(document.querySelector('#popup-message-container')).toBeTruthy();
        await expect(document.querySelector('#popup-message-container')?.textContent).toEqual(errorMsg);
    });

    it('sends \'register\' request if type is \'register\' and renders a popup on unsuccesfull resp', async () => {        
        const popupContainer = document.createElement('div');
        popupContainer.setAttribute('id', 'popup-portal-container');
        document.body.appendChild(popupContainer);
        
        const registerType: AuthFormType = AuthFormType.Register;
        const errorMsg = 'My error message';
        jest.spyOn(requests, 'register')
            .mockImplementation(() => Promise.resolve({ data: { errors: [ { message: errorMsg } ] }, status: 500 } as AxiosResponse));
        
        wrapper = mount(
            <AuthForm type={registerType} />
        );

        const form = wrapper.find(CardHOC).find('form').first();
        const emailInput = form.find('input[type="email"]').first();
        const passwordInput = form.find('input[type="password"]').first();

        expect(document.querySelector('#popup-message-container')).toBeFalsy();
        
        await act(async () => {
            await emailInput.simulate('change', { target: { value: 'test@test.com' } });
        });
        await act(async () => {
            await passwordInput.simulate('change', { target: { value: 'mypwd' } });
        });
        await act(async () => {
            await form.simulate('submit');
        });

        await wrapper.update();

        await expect(document.querySelector('#popup-message-container')).toBeTruthy();
        await expect(document.querySelector('#popup-message-container')?.textContent).toEqual(errorMsg);
    });
});