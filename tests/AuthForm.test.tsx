import React from 'react';
import {configure, mount, ReactWrapper} from 'enzyme';
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import AuthForm, { AuthFormType } from '../components/AuthForm';
import CardHOC from '../components/CardHOC';
import * as requests from "../requests";
import { AxiosResponse } from 'axios';
jest.mock('next/router', () => ({
    useRouter() {
      return ({
        push: jest.fn(),
      });
    },
  }));

describe("AuthForm spec", () => {
    let wrapper: ReactWrapper;

    beforeEach(() => {
        configure({ adapter: new Adapter() });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('sends \'login\' request if type is \'login\'', (done) => {
        const loginType: AuthFormType = AuthFormType.Login;
        const loginSpy = jest.spyOn(requests, 'login')
            .mockImplementation(() => Promise.resolve({ data: { data: { login: { success: true } } }, status: 200 } as AxiosResponse));
        
        wrapper = mount(
            <AuthForm type={loginType} />
        );

        const form = wrapper.find(CardHOC).find('form');
        const emailInput = form.find('input[type="email"]');
        const passwordInput = form.find('input[type="password"]');
        
        emailInput.simulate('change', { target: { value: 'test@test.com' } });
        passwordInput.simulate('change', { target: { value: 'mypwd' } });
        form.simulate('submit');

        wrapper.update();

        setTimeout(() => {
            expect(loginSpy).toHaveBeenCalled();
            done();
        }, 500);
    });

    it('sends \'register\' request if type is \'register\'', (done) => {
        const registerType: AuthFormType = AuthFormType.Register;
        const registerSpy = jest.spyOn(requests, 'register')
            .mockImplementation(() => Promise.resolve({ data: { data: { register: { success: true } } }, status: 200 } as AxiosResponse));

        wrapper = mount(
            <AuthForm type={registerType} />
        );

        const form = wrapper.find(CardHOC).find('form');
        const emailInput = form.find('input[type="email"]');
        const passwordInput = form.find('input[type="password"]');
        
        emailInput.simulate('change', { target: { value: 'test@test.com' } });
        passwordInput.simulate('change', { target: { value: 'mypwd' } });
        form.simulate('submit');

        wrapper.update();

        setTimeout(() => {
            expect(registerSpy).toHaveBeenCalled();
            done();
        }, 500);
    });
});