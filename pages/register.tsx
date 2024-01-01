import React, {ChangeEvent, FormEvent, useState} from "react";
import {useRouter} from "next/router";
import {register} from "../requests";
import {HeadComponent} from "../components/HeadComponent";
import getConfig from "next/config";

export function getStaticProps() {
    const {publicRuntimeConfig} = getConfig();
    const nodeServerHost = publicRuntimeConfig?.nodeServerHost || null;

    return { props: { nodeServerHost } };
}

interface RegisterProps {
    nodeServerHost: string | null;
}

export default function Register(props: RegisterProps) {
    const {nodeServerHost} = props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        register(email, password, nodeServerHost).then(resp => {
            if (resp.data.errors) throw new Error(resp.data.errors[0].message);
            if (resp.status === 200 && resp.data.data.register.success) {
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
        <>
            <HeadComponent />
            <form onSubmit={handleSubmit}>
                <span>Email:</span> <input type='email' onChange={handleEmailChange}/><br/>
                <span>Password:</span> <input type='password' onChange={handlePasswordChange}/><br/>
                <button type='submit'>Submit</button>
            </form>
            <br/>
            <br/>
            <button onClick={() => router.replace('/login')}>Login</button>
        </>
    );
}
