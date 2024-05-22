import Home, {HomeProps, ScrapeConfig} from "./home";
import {getJobGroupNames, getScrapeConfigs, isAuthorized} from "../requests";

export const getServerSideProps = async ({req}): Promise<{props: HomeProps}> => {
    let _configs: ScrapeConfig[] = [];
    let _groupNames: string[] = [];
    let _auth: string | null = null;
    const nodeServerHost = process.env.NEXT_PUBLIC_NODE_SERVER_HOST || null;
    const springServerHost = process.env.NEXT_PUBLIC_SPRING_SERVER_HOST || null;

    if (process.env.NEXT_PUBLIC_LOCAL) {
        _configs = [
            {
                id: 1,
                host: "https://www.nofluffjobs.com",
                path: "/jobs/remote/fullstack?criteria=city%3Dwarszawa%20%20requirement%3Djava,react&page={}",
                jobAnchorSelector: "a[class*=\"posting-list-item\"]",
                jobLinkContains: "job",
                numberOfPages: 2,
                interval: 3600000
            },
            {
                id: 2,
                host: "https://bulldogjob.pl",
                path: "/companies/jobs/s/city,Remote,Warszawa/role,fullstack/skills,Java,JavaScript/page.{}",
                jobAnchorSelector: "a[class*=\"shadow-jobitem\"]",
                jobLinkContains: "jobs",
                numberOfPages: 1,
                interval: 60000
            }
        ];
        _groupNames = ['nofluffjobs', 'bulldogjob'];
        _auth = '5de68023-2253-40f7-b38d-010e3b546319';
    } else {
        await getScrapeConfigs(true, req.headers.cookie, springServerHost).then(resp => {
            if (resp.status === 200 && resp.data.data && resp.data.data.getPages && resp.data.data.getPages.length)
                _configs = resp.data.data.getPages;
        }).catch(e => console.log(e));
        await getJobGroupNames(true, req.headers.cookie, nodeServerHost).then(resp => {
            if (resp.status === 200 && resp.data.data && resp.data.data.getGroupNames && resp.data.data.getGroupNames.names)
                _groupNames = resp.data.data.getGroupNames.names;
        }).catch(e => console.log(e));
        _auth = await isAuthorized(true, req.headers.cookie, nodeServerHost);
    }

    return { props: { _auth, _configs, _groupNames, nodeServerHost, springServerHost } };
}

const App = (props) => <Home {...props}/>;

export default App;
