import React, {useState} from "react";
import {ScrapeConfig} from "../pages/home";
import {getScrapeConfigs, modifyScrapeConfig, persistScrapeConfig, removeScrapeConfig, scrape} from "../requests";
import CardHOC from "./CardHOC";

interface ConfigsProps {
    _configs: ScrapeConfig[];
    setPopupMessage: (value: string) => void;
    nodeServerHost?: string;
    springServerHost?: string;
}

export const Configs = (props: ConfigsProps) => {
    const { _configs, setPopupMessage, nodeServerHost, springServerHost } = props;

    const [id, setId] = useState('');
    const [host, setHost] = useState('');
    const [path, setPath] = useState('');
    const [jobAnchorSelector, setJobAnchorSelector] = useState('');
    const [jobLinkContains, setJobLinkContains] = useState('');
    const [numberOfPages, setNumberOfPages] = useState('');
    const [interval, setInterval] = useState('');
    const [configs, setConfigs] = useState(_configs);

    const renderConfigs = (configs: ScrapeConfig[]) => (
        configs && configs.map((config, i) => (
            <div key={i} style={{marginBottom: '1rem'}}>
                <div>Id: {config.id}</div>
                <div>Host: {config.host}</div>
                <div>Path: {config.path}</div>
                <div>Job anchor selector: {config.jobAnchorSelector}</div>
                <div>Job link contains: {config.jobLinkContains}</div>
                <div>Number of pages: {config.numberOfPages}</div>
                <div>Interval [ms]: {config.interval}</div>
                <button className='btn btn-light' onClick={() => handleDeleteConfig(config.id)}>Delete config at Spring</button>
            </div>
        ))
    );

    const handleScrape = () => {
        scrape(host, path, jobAnchorSelector, jobLinkContains, parseInt(numberOfPages), nodeServerHost).then(resp => {
            if (resp.status === 200 && resp.data.data && resp.data.data.scrape && resp.data.data.scrape.complete) setPopupMessage('Scrape performed successfully');
        }).catch(e => console.log(e));
    }

    const handleAddConfig = () => {
        persistScrapeConfig(host, path, jobAnchorSelector, jobLinkContains, parseInt(numberOfPages), parseInt(interval), springServerHost).then(resp => {
            if (resp.status === 200 && resp.data.data && resp.data.data.addPage) setPopupMessage('Config added successfully');
        }).catch(e => console.log(e));
    }

    const handleDeleteConfig = (id: number) => {
        removeScrapeConfig(id, springServerHost).then(resp => {
            if (resp.status === 200 && resp.data.data && resp.data.data.addPage) {
                getScrapeConfigs(false, "", springServerHost).then(resp => {
                    if (resp.status === 200 && resp.data.data && resp.data.data.getPages && resp.data.data.getPages.length) {
                        setConfigs(resp.data.data.getPages);
                        setPopupMessage('Config removed successfully');
                    }
                });
            }
        }).catch(e => console.log(e));
    }

    const handleModifyConfig = () => {
        modifyScrapeConfig(parseInt(id), host, path, jobAnchorSelector, jobLinkContains, parseInt(numberOfPages), parseInt(interval), springServerHost).then(resp => {
            if (resp.status === 200 && resp.data.data && resp.data.data.modifyPage) setPopupMessage('Config modified successfully');
        }).catch(e => console.log(e));
    }

    return (
        <>
            <CardHOC title={<h3>Add/edit config:</h3>} body={
                <>
                    Id: <input type={'text'} value={id} onChange={e => setId(e.target.value)}/>
                    Host: <input type={'text'} value={host} onChange={e => setHost(e.target.value)}/>
                    Path: <input type={'text'} value={path} onChange={e => setPath(e.target.value)}/><br/>
                    Job anchor selector: <input type={'text'} value={jobAnchorSelector} onChange={e => setJobAnchorSelector(e.target.value)}/>
                    Job link contains: <input type={'text'} value={jobLinkContains} onChange={e => setJobLinkContains(e.target.value)}/><br/>
                    Number of pages: <input type={'text'} value={numberOfPages} onChange={e => setNumberOfPages(e.target.value)}/>
                    Interval [ms]: <input type={'text'} value={interval} onChange={e => setInterval(e.target.value)}/><br/>
                    <button className='btn btn-light' onClick={handleScrape}>Scrape now!</button>
                    <button className='btn btn-light' onClick={handleAddConfig}>Add config</button>
                    <button className='btn btn-light' onClick={handleModifyConfig}>Modify config</button>

                </>} />
                <CardHOC title={<h3>Configs:</h3>} body={renderConfigs(configs)} />
        </>
    );
};
