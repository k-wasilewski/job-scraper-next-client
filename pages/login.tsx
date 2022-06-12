import React, {ChangeEvent, FormEvent, useState} from "react";
import {useRouter} from "next/router";
import {login} from "../requests";
import {HeadComponent} from "../components/HeadComponent";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        login(email, password).then(resp => {
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
        <>
            <HeadComponent />
            <form onSubmit={handleSubmit}>
                <span>Email:</span> <input type='email' onChange={handleEmailChange}/><br/>
                <span>Password:</span> <input type='password' onChange={handlePasswordChange}/><br/>
                <button type='submit'>Submit</button>
            </form>
            <br/>
            <br/>
            <button onClick={() => router.replace('/register')}>Register</button>
        </>
    );
}