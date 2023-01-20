import React, {ChangeEvent, FormEvent, useState} from "react";
import {useRouter} from "next/router";
import {login} from "../requests";
import {HeadComponent} from "../components/HeadComponent";
import getConfig from "next/config";
import CardHOC from '../components/CardHOC';

export function getStaticProps() {
    const {publicRuntimeConfig} = getConfig();
    const nodeServerHost = publicRuntimeConfig.nodeServerHost || null;

    return { props: { nodeServerHost } };
}

interface LoginProps {
    nodeServerHost: string | null;
}

export default function Login(props: LoginProps) {
    const {nodeServerHost} = props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        login(email, password, nodeServerHost).then(resp => {
            if (resp.data.errors) throw new Error(resp.data.errors[0].message);
            if (resp.status === 200 && resp.data.data.login.success) {
                router.push('/');
            }
        })
    }

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setPassword(e.target.value);
    }

    return (
        <div className="d-flex flex-column align-items-center">
            <HeadComponent />
            <CardHOC
                title='Log in to the job-scraper'
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
            <button className='btn btn-light float-left' onClick={() => router.replace('/register')}>Register</button>
            </div>
        </div>
    );
}
