import Home, {HomeProps, ScrapeConfig} from "./home";
import {getJobGroupNames, getScrapeConfigs, isAuthorized} from "../requests";
import getConfig from "next/config";

export const getServerSideProps = async ({req}): Promise<{props: HomeProps}> => {
    let _configs: ScrapeConfig[] = [];
    let _groupNames: string[] = [];
    let _auth: string | null = null;
    const { publicRuntimeConfig } = getConfig();
    await getScrapeConfigs(true, req.headers.cookie).then(resp => {
        if (resp.status === 200 && resp.data.data && resp.data.data.getPages && resp.data.data.getPages.length)
            _configs = resp.data.data.getPages;
    }).catch(e => console.log(e));
    await getJobGroupNames(true, req.headers.cookie).then(resp => {
        if (resp.status === 200 && resp.data.data && resp.data.data.getGroupNames && resp.data.data.getGroupNames.names)
            _groupNames = resp.data.data.getGroupNames.names;
    }).catch(e => console.log(e));
    _auth = await isAuthorized(true, req.headers.cookie);
    return { props: { _auth, _configs, _groupNames, nodeServerHost: publicRuntimeConfig.nodeServerHost || null, springServerHost: publicRuntimeConfig.springServerHost || null } };
}

export default function App(props) {
    return <Home {...props}/>;
}
