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
import {PortalComponent} from "../components/PortalComponent";
import {connect} from "react-redux";
import {setTheme} from "../redux/actions";
import { Theme } from "../redux/reducers";
import { getFromLocalStorage, setToLocalStorage } from "../utils/themeService";
import Navbar from "../components/Navbar";

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
    theme: Theme;
    setTheme: (theme: Theme) => void;
    nodeServerHost?: string;
    springServerHost?: string;
}

const Home: NextPage<HomeProps> = (props: HomeProps) => {
    const { _auth, _configs, _groupNames, nodeServerHost, springServerHost, theme, setTheme } = props;
    const [popupMessage, setPopupMessage] = useState('');

    const router = useRouter();

    const isDark = theme === Theme.Dark;

    useEffect(() => {
        //if (!_auth) logout();
    }, [router, _auth]);

    useEffect(() => {
        const theme: Theme = getFromLocalStorage() || Theme.Light;
        setTheme(theme);
        setToLocalStorage(theme);
    }, []);

    return (
        <div className={`${styles.container} ${isDark ? 'bg-dark' : ''}`}>
            <HeadComponent />
            <main>
                <Navbar/>
                <div className="row">
                    <div className="col-lg">
                        <ApolloProvider client={apollo_client2}>
                            <SpringServerHeartbeat />
                        </ApolloProvider>
                    </div>
                    <div className="col-lg">
                        <ApolloProvider client={apollo_client}>
                            <NodeServerHeartbeat />
                        </ApolloProvider>
                    </div>
                </div>

                <Configs _configs={_configs} setPopupMessage={setPopupMessage} nodeServerHost={nodeServerHost} springServerHost={springServerHost} />

                <Jobs _groupNames={_groupNames} setPopupMessage={setPopupMessage} currentUserUuid={_auth} nodeServerHost={nodeServerHost} springServerHost={springServerHost} />

                <PortalComponent
                    renderCondition={!!popupMessage}
                    rootElementId={'popup-portal-container'}
                    element={
                        <Popup message={popupMessage} onClose={() => setPopupMessage('')} />
                    }
                />
            </main>
        </div>
    )
}

const mapStateToProps = (state) => ({
    theme: state.themeReducer.theme  
});

const mapDispatchToProps = {
    setTheme
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
