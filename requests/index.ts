import axios from "axios";
import exp from "constants";

export const NODE_SERVER_HOST = "localhost:8080";
export const DOCKERIZED_NODE_SERVER_HOST = "job-scraper-node-server:8080";
export const SPRING_SERVER_HOST = "localhost:8081";
export const DOCKERIZED_SPRING_SERVER_HOST = "job-scraper-spring-server:8081";

export const NODE_SERVER_ENDPOINT = "http://" + NODE_SERVER_HOST + "/graphql";
export const DOCKERIZED_NODE_SERVER_ENDPOINT = "http://" + DOCKERIZED_NODE_SERVER_HOST + "/graphql";
export const SPRING_SERVER_ENDPOINT =  "http://" + SPRING_SERVER_HOST + "/graphql";
export const DOCKERIZED_SPRING_SERVER_ENDPOINT =  "http://" + DOCKERIZED_SPRING_SERVER_HOST + "/graphql";
export const NODE_SERVER_SUBSCRIPTIONS_ENDPOINT = "ws://" + NODE_SERVER_HOST + "/subscriptions";
export const SPRING_SERVER_SUBSCRIPTIONS_ENDPOINT = "ws://" + SPRING_SERVER_HOST + "/subscriptions";

const getScrapeData = (host: string, path: string, jobAnchorSelector: string, jobLinkContains: string, numberOfPages: number) => {
    const _host = host.replace(/"/g, '&quot');
    const _path = path.replace(/"/g, '&quot');
    const _jobAnchorSelector = jobAnchorSelector.replace(/"/g, '&quot');
    const _jobLinkContains = jobLinkContains.replace(/"/g, '&quot');
    return { "query": `mutation { scrape(host: \"${_host}\", path: \"${_path}\", jobAnchorSelector: \"${_jobAnchorSelector}\", jobLinkContains: \"${_jobLinkContains}\", numberOfPages: ${numberOfPages}) { complete } }`};
}

const getAddScrapeConfigData = (host: string, path: string, jobAnchorSelector: string, jobLinkContains: string, numberOfPages: number, interval: number) => {
    const _host = host.replace(/"/g, '&quot');
    const _path = path.replace(/"/g, '&quot');
    const _jobAnchorSelector = jobAnchorSelector.replace(/"/g, '&quot');
    const _jobLinkContains = jobLinkContains.replace(/"/g, '&quot');
    return { "query": `mutation { addPage(host: \"${_host}\", path: \"${_path}\", jobAnchorSelector: \"${_jobAnchorSelector}\", jobLinkContains: \"${_jobLinkContains}\", numberOfPages: ${numberOfPages}, interval: ${interval}) { id, host, path, jobAnchorSelector, jobLinkContains, numberOfPages, interval } }`};
}

const getModifyScrapeConfigData = (id: number, host: string, path: string, jobAnchorSelector: string, jobLinkContains: string, numberOfPages: number, interval: number) => {
    const _host = host.replace(/"/g, '&quot');
    const _path = path.replace(/"/g, '&quot');
    const _jobAnchorSelector = jobAnchorSelector.replace(/"/g, '&quot');
    const _jobLinkContains = jobLinkContains.replace(/"/g, '&quot');
    return { "query": `mutation { modifyPage(id: ${id}, host: \"${_host}\", path: \"${_path}\", jobAnchorSelector: \"${_jobAnchorSelector}\", jobLinkContains: \"${_jobLinkContains}\", numberOfPages: ${numberOfPages}, interval: ${interval}) { id, host, path, jobAnchorSelector, jobLinkContains, numberOfPages, interval } }`};
}

const getScrapeConfigsData = () => {
    return { "query": "{ getPages { id, host, path, jobAnchorSelector, jobLinkContains, numberOfPages, interval } }"};
}

const getGroupNamesData = () => {
    return { "query": "{ getGroupNames { names } }"};
}

const getIsAuthorizedData = () => {
    return { "query": "{ verify { user { uuid, email } } }"};
}

const getScreenshotsData = (groupName: string) => {
    return { "query": `{ getScreenshotsByGroup(groupName: \"${groupName}\") { files } }`};
}

const removeScrapeConfigData = (id: number) => {
    return { "query": `mutation { deletePage(id: ${id}) { id, host, path, jobAnchorSelector, jobLinkContains, numberOfPages, interval } }`};
}

const getRemoveJobData = (group: string, uuid: string) => {
    return { "query": `mutation { removeScreenshotByGroupAndUuid(groupName: \"${group}\", uuid: \"${uuid}\") { deleted } }`};
}

const getRemoveJobGroupData = (group: string) => {
    return { "query": `mutation { removeAllScreenshotsByGroup(groupName: \"${group}\") { deleted } }`};
}

const getLoginData = (email: string, password: string) => {
    return { "query": `mutation { login(email: \"${email}\", password: \"${password}\") { success, error { message }, user { email } } }`};
}

const getRegisterData = (email: string, password: string) => {
    return { "query": `mutation { register(email: \"${email}\", password: \"${password}\") { success, error { message }, user { email } } }`};
}

export const scrape = (host: string, path: string, jobAnchorSelector: string, jobLinkContains: string, numberOfPages: number) => {
    return axios.post(NODE_SERVER_ENDPOINT, getScrapeData(host, path, jobAnchorSelector, jobLinkContains, numberOfPages));
}

export const persistScrapeConfig = (host: string, path: string, jobAnchorSelector: string, jobLinkContains: string, numberOfPages: number, interval: number) => {
    return axios.post(SPRING_SERVER_ENDPOINT, getAddScrapeConfigData(host, path, jobAnchorSelector, jobLinkContains, numberOfPages, interval));
}

export const modifyScrapeConfig = (id: number, host: string, path: string, jobAnchorSelector: string, jobLinkContains: string, numberOfPages: number, interval: number) => {
    return axios.post(SPRING_SERVER_ENDPOINT, getModifyScrapeConfigData(id, host, path, jobAnchorSelector, jobLinkContains, numberOfPages, interval));
}

export const removeScrapeConfig = (id: number) => {
    return axios.post(SPRING_SERVER_ENDPOINT, removeScrapeConfigData(id));
}

export const getScrapeConfigs = (dockerized?: boolean, cookie?: string) => {
    const config = cookie ? {
      headers: {
          Cookie: cookie
      }
    } : null;
    return axios.post(dockerized ? DOCKERIZED_SPRING_SERVER_ENDPOINT : SPRING_SERVER_ENDPOINT, getScrapeConfigsData(), config);
}

export const getJobGroupNames = (dockerized?: boolean, cookie?: string) => {
    const config = cookie ? {
        headers: {
            Cookie: cookie
        }
    } : null;
    return axios.post(dockerized ? DOCKERIZED_NODE_SERVER_ENDPOINT : NODE_SERVER_ENDPOINT, getGroupNamesData(), config);
}

export const getJobsByGroup = (group: string) => {
    return axios.post(NODE_SERVER_ENDPOINT, getScreenshotsData(group));
}

export const removeJobByGroupAndUuid = (group: string, uuid: string) => {
    return axios.post(NODE_SERVER_ENDPOINT, getRemoveJobData(group, uuid));
}

export const removeJobGroupByName = (group: string) => {
    return axios.post(NODE_SERVER_ENDPOINT, getRemoveJobGroupData(group));
}

export const isAuthorized = (dockerized?: boolean, cookie?: string) => {
    const config = cookie ? {
        headers: {
            Cookie: cookie
        }
    } : null;
    return axios.post(dockerized ? DOCKERIZED_NODE_SERVER_ENDPOINT : NODE_SERVER_ENDPOINT, getIsAuthorizedData(), config)
        .then(resp => resp.data.data.verify.user !== null)
        .catch(err => false);
}

export const login = (email: string, password: string) => {
    return axios.post(NODE_SERVER_ENDPOINT, getLoginData(email, password));
}

export const register = (email: string, password: string) => {
    return axios.post(NODE_SERVER_ENDPOINT, getRegisterData(email, password));
}

axios.defaults.withCredentials = true;