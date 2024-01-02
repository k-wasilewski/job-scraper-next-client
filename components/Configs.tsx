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

    const unescapeQuotes: (str: string) => string = (str: string) => {
        return str.replaceAll('&quot', '"');
    }

    const millisToMin: (millis: number) => number = (millis: number) => {
        return millis / 60 / 1000;
    }

    const renderConfigs = (configs: ScrapeConfig[]) => (
        configs && configs.map((config, i) => (
            <div key={i}>
                <div>
                    <span style={{display: 'inline-block', minWidth: '150px'}}>Id: </span>
                    <span>{config.id}</span>
                </div>
                <div>
                    <span style={{display: 'inline-block', minWidth: '150px'}}>Host: </span>
                    <span>{config.host}</span>
                </div>
                <div>
                    <span style={{display: 'inline-block', minWidth: '150px'}}>Path: </span>
                    <span>{config.path}</span>
                </div>
                <div>
                    <span style={{display: 'inline-block', minWidth: '150px'}}>Job anchor selector: </span>
                    <span>{unescapeQuotes(config.jobAnchorSelector)}</span>
                </div>
                <div>
                    <span style={{display: 'inline-block', minWidth: '150px'}}>Job link contains: </span>
                    <span>{config.jobLinkContains}</span>
                </div>
                <div>
                    <span style={{display: 'inline-block', minWidth: '150px'}}>Number of pages: </span>
                    <span>{config.numberOfPages}</span>
                </div>
                <div>
                    <span style={{display: 'inline-block', minWidth: '150px'}}>Interval [min]: </span>
                    <span>{config.interval}</span>
                </div>

                <button className='my-2 btn btn-light' onClick={() => handleDeleteConfig(config.id)}>Delete config</button>
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

    const minToMillis: (min: string) => string = (min: string) => {
        if (isNaN(parseInt(min))) return;
        return (parseInt(min) * 60 * 1000).toString();
    }

    const content = (
        <>
            <div className="my-2">
                <span style={{display: 'inline-block', minWidth: '150px'}}>Id: </span>
                <input type='text' value={id} onChange={e => setId(e.target.value)}/>
            </div>
            <div className="my-2">
                <span style={{display: 'inline-block', minWidth: '150px'}}>Host: </span>
                <input type='text' value={host} onChange={e => setHost(e.target.value)}/>
            </div>
            <div className="my-2">
                <span style={{display: 'inline-block', minWidth: '150px'}}>Path: </span>
                <input type='text' value={path} onChange={e => setPath(e.target.value)}/>
            </div>
            <div className="my-2">
                <span style={{display: 'inline-block', minWidth: '150px'}}>Job anchor selector: </span>
                <input type='text' value={jobAnchorSelector} onChange={e => setJobAnchorSelector(e.target.value)}/>
            </div>
            <div className="my-2">
                <span style={{display: 'inline-block', minWidth: '150px'}}>Job link contains: </span>
                <input type='text' value={jobLinkContains} onChange={e => setJobLinkContains(e.target.value)}/>
            </div>
            <div className="my-2">
                <span style={{display: 'inline-block', minWidth: '150px'}}>Number of pages: </span>
                <input type='text' value={numberOfPages} onChange={e => setNumberOfPages(e.target.value)}/>
            </div>
            <div className="my-2">
                <span style={{display: 'inline-block', minWidth: '150px'}}>Interval [min]: </span>
                <input type='string' value={interval} onChange={e => setInterval(minToMillis(e.target.value))}/>
            </div>
            
            <div className="row my-2">
                <button className='col-1 btn btn-light mx-2' onClick={handleScrape}>Scrape now!</button>
                <button className='col-1 btn btn-light mx-2' onClick={handleAddConfig}>Add config</button>
                <button className='col-1 btn btn-light mx-2' onClick={handleModifyConfig}>Modify config</button>
            </div>
        </>
    );

    return (
        <>
            <button className="btn btn-light d-block my-2" data-bs-toggle="collapse" data-bs-target="#add-edit-config">
                Add/edit config
            </button>
            <div className="collapse" id="add-edit-config">
                <CardHOC title={<h3>Add/edit config:</h3>} body={content}/>
            </div>
            
            <button className="btn btn-light d-block my-2" data-bs-toggle="collapse" data-bs-target="#config-list">
                Config list
            </button>
            <div className="collapse" id="config-list">
                <CardHOC title={<h3>Config list:</h3>} body={renderConfigs(configs)}/>
            </div>
        </>
    );
};
