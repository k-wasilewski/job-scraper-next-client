import React, {useEffect, useState} from "react";
import styles from '../styles/Home.module.css'
import {ApolloProvider} from "@apollo/client";
import apollo_client2 from "../apollo_client2";
import SpringServerHeartbeat from "../components/SpringServerHeartbeat";
import apollo_client from "../apollo_client";
import NodeServerHeartbeat from "../components/NodeServerHeartbeat";
import {Popup} from "../components/Popup";
import { useRouter } from "next/router";
import {NextPage} from "next";
import {HeadComponent} from "../components/HeadComponent";
import {Configs} from "../components/Configs";
import {Jobs} from "../components/Jobs";

export interface ScrapeConfig {
    id: number;
    host: string;
    path: string;
    jobAnchorSelector: string;
    jobLinkContains: string;
    numberOfPages: number;
    interval: number;
}

export interface HomeProps {
    _auth: string | null;
    _configs: ScrapeConfig[];
    _groupNames: string[];
}

const Home: NextPage<HomeProps> = (props: HomeProps) => {
    const { _auth, _configs, _groupNames } = props;
    const [popupMessage, setPopupMessage] = useState('');

    const router = useRouter();

    useEffect(() => {
        if (!_auth) logout();
    }, [router, _auth]);

    const logout = () => {
        router.replace('/login');
    }

    return (
        <div className={styles.container}>
            <HeadComponent />
            <main>
                <button onClick={logout}>Logout</button>

                <br/>
                <br/>

                <ApolloProvider client={apollo_client2}>
                    <SpringServerHeartbeat />
                </ApolloProvider>

                <ApolloProvider client={apollo_client}>
                    <NodeServerHeartbeat />
                </ApolloProvider>

                <Configs _configs={_configs} setPopupMessage={setPopupMessage}/>

                <Jobs _groupNames={_groupNames} setPopupMessage={setPopupMessage} currentUserUuid={_auth} />

                <Popup message={popupMessage} onClose={() => setPopupMessage('')} />
            </main>
        </div>
    )
}

export default Home;