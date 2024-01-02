import React, {ChangeEvent, FormEvent, useState} from "react";
import {useRouter} from "next/router";
import {login, register} from "../requests";
import {HeadComponent} from "../components/HeadComponent";
import CardHOC from '../components/CardHOC';

interface AuthFormProps {
    type: AuthFormType;
    nodeServerHost?: string;
}

export enum AuthFormType {
    Login = 'login',
    Register = 'register'
}

const AuthForm = (props: AuthFormProps) => {
    const {type, nodeServerHost} = props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (type === AuthFormType.Login) {
            login(email, password, nodeServerHost).then(resp => {
                if (resp.data.errors) throw new Error(resp.data.errors[0].message);
                if (resp.status === 200 && resp.data.data.login.success) {
                    router.push('/');
                }
            });
        } else if (type === AuthFormType.Register) {
            register(email, password, nodeServerHost).then(resp => {
                if (resp.data.errors) throw new Error(resp.data.errors[0].message);
                if (resp.status === 200 && resp.data.data.register.success) {
                    router.push('/');
                }
            });
        }
    }

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setPassword(e.target.value);
    }

    const cardTitle = () => {
        if (type === AuthFormType.Login) {
            return 'Log in to job-scraper';
        } else if (type === AuthFormType.Register) {
            return 'Register at job-scraper';
        }
    }

    const switchPageBtn = () => {
        if (type === AuthFormType.Login) {
            return (
                <button className='btn btn-light float-left' onClick={() => router.replace('/register')}>Register</button>
            );
        } else if (type === AuthFormType.Register) {
            return (
                <button className='btn btn-light float-left' onClick={() => router.replace('/login')}>Login</button>
            );
        }
    }

    return (
        <div className="d-flex flex-column align-items-center">
            <HeadComponent />
            <CardHOC
                title={cardTitle()}
                className="w-50"
                body={
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-1">
                            <div className="col-2">
                                <span>Email:</span>
                            </div>
                            <div className="col-1">
                                <input type='email' onChange={handleEmailChange}/>
                            </div>
                        </div>
                        <div className="row mb-1">
                            <div className="col-2">
                                <span className="col-sm">Password:</span>
                            </div>
                            <div className="col-1">
                                <input type='password' onChange={handlePasswordChange}/>
                            </div>
                        </div>
                        <button className='btn btn-light' type='submit'>Submit</button>
                    </form>
                }
            />
            <br/>
            <br/>
            <div className="w-50">
                {switchPageBtn()}
            </div>
        </div>
    );
}

export default AuthForm;