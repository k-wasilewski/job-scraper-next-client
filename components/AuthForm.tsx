import React, {ChangeEvent, FormEvent, useState} from "react";
import {useRouter} from "next/router";
import {login, register} from "../requests";
import {HeadComponent} from "../components/HeadComponent";
import CardHOC from '../components/CardHOC';
import { PortalComponent } from "./PortalComponent";
import { Popup } from "./Popup";
import styles from "../styles/AuthForm.module.css";

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
    const [popupMessage, setPopupMessage] = useState('');

    const router = useRouter();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (type === AuthFormType.Login) {
            login(email, password, nodeServerHost).then(resp => {
                if (resp.data.errors) setPopupMessage(resp.data.errors[0].message);
                else if (resp.status === 200 && resp.data.data.login.success) {
                    router.push('/');
                }
            });
        } else if (type === AuthFormType.Register) {
            register(email, password, nodeServerHost).then(resp => {
                if (resp.data.errors) setPopupMessage(resp.data.errors[0].message);
                else if (resp.status === 200 && resp.data.data.register.success) {
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
            return <h5>Log in to job-scraper</h5>;  // implement more of h5 headings
        } else if (type === AuthFormType.Register) {
            return <h5>Register at job-scraper</h5>;
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

    const rwdCardBody = () => (
        <>
            <form className={styles.form_large} onSubmit={handleSubmit}>
                <div className="row mb-1">
                    <div className="col-2">
                        <span className="col-sm">Email:</span>
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

            <form className={styles.form_small} onSubmit={handleSubmit}>
                <div className="row mb-1">
                    <span className="col-sm">Email:</span>
                    <div className="mx-1">
                        <input type='email' onChange={handleEmailChange}/>
                    </div>
                </div>
                <div className="row mb-1">
                    <span className="col-sm">Password:</span>
                    <div className="mx-1">
                        <input type='password' onChange={handlePasswordChange}/>
                    </div>
                </div>
                <button className='btn btn-light' type='submit'>Submit</button>
            </form>
        </>
    );

    return (
        <div className="d-flex flex-column align-items-center">
            <HeadComponent />
            <CardHOC
                title={cardTitle()}
                className={styles.card_hoc_wrapper}
                body={rwdCardBody()}
            />
            <br/>
            <br/>
            <div id='switchPageBtn' className="w-50">
                {switchPageBtn()}
            </div>

            <PortalComponent
                renderCondition={!!popupMessage}
                rootElementId={'popup-portal-container'}
                element={
                    <Popup message={popupMessage} onClose={() => setPopupMessage('')} />
                }
            />
        </div>
    );
}

export default AuthForm;