import Home, {HomeProps, ScrapeConfig} from "./home";
import {getJobGroupNames, getScrapeConfigs, isAuthorized} from "../requests";

export const getServerSideProps = async ({req}): Promise<{props: HomeProps}> => {
    let _configs: ScrapeConfig[] = [];
    let _groupNames: string[] = [];
    let _auth: string | null = null;
    const nodeServerHost = process.env.NEXT_PUBLIC_NODE_SERVER_HOST || null;
    const springServerHost = process.env.NEXT_PUBLIC_SPRING_SERVER_HOST || null;
    await getScrapeConfigs(true, req.headers.cookie, springServerHost).then(resp => {
        if (resp.status === 200 && resp.data.data && resp.data.data.getPages && resp.data.data.getPages.length)
            _configs = resp.data.data.getPages;
    }).catch(e => console.log(e));
    await getJobGroupNames(true, req.headers.cookie, nodeServerHost).then(resp => {
        if (resp.status === 200 && resp.data.data && resp.data.data.getGroupNames && resp.data.data.getGroupNames.names)
            _groupNames = resp.data.data.getGroupNames.names;
    }).catch(e => console.log(e));
    _auth = await isAuthorized(true, req.headers.cookie, nodeServerHost);
    return { props: { _auth, _configs, _groupNames, nodeServerHost, springServerHost } };
}

const App = (props) => <Home {...props}/>;

export default App;
