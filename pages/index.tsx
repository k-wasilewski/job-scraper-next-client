import React, {useEffect, useState} from "react";
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {
    getJobGroupNames, getJobsByGroup, getScrapeConfigs, modifyScrapeConfig, NODE_SERVER_HOST,
    persistScrapeConfig, removeJobByGroupAndUuid, removeScrapeConfig,
    scrape,
} from "../requests";
import {ApolloProvider} from "@apollo/client";
import apollo_client2 from "../apollo_client2";
import SpringServerHeartbeat from "../components/SpringServerHeartbeat";
import apollo_client from "../apollo_client";
import NodeServerHeartbeat from "../components/NodeServerHeartbeat";
import {ImageGallery} from "../components/ImageGallery";
import {createWrapperAndAppendToBody} from "../utils/createPortal";
import ReactDOM from "react-dom";
import {Popup} from "../components/Popup";
//TODO: authorization -> dashboard = config + results and handling 2x notifications

interface ScrapeConfig {
    id: number;
    host: string;
    path: string;
    jobAnchorSelector: string;
    jobLinkContains: string;
    numberOfPages: number;
    interval: number;
}

export default function Home() {
  const [id, setId] = useState('');
  const [host, setHost] = useState('');
  const [path, setPath] = useState('');
  const [jobAnchorSelector, setJobAnchorSelector] = useState('');
  const [jobLinkContains, setJobLinkContains] = useState('');
  const [numberOfPages, setNumberOfPages] = useState('');
  const [interval, setInterval] = useState('');
  const [configs, setConfigs] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [activeGroup, setActiveGroup] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loadingScreenshots, setLoadingScreenshots] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const galleryPortalId = 'gallery-portal-container';
  const popupPortalId = 'popup-portal-container';

  useEffect(() => {
      getScrapeConfigs().then(resp => {
          if (resp.status === 200 && resp.data.data && resp.data.data.getPages && resp.data.data.getPages.length)
              setConfigs(resp.data.data.getPages);
      });
      getJobGroupNames().then(resp => {
          if (resp.status === 200 && resp.data.data && resp.data.data.getGroupNames && resp.data.data.getGroupNames.names)
              setGroupNames(resp.data.data.getGroupNames.names);
      });
  }, []);

  useEffect(() => {
    if (activeGroup) {
        const portalWrapper = document.getElementById(galleryPortalId);
        if (!portalWrapper) createWrapperAndAppendToBody(galleryPortalId);
    }
  }, [activeGroup]);

  useEffect(() => {
      if (popupMessage) {
          const portalWrapper = document.getElementById(popupPortalId);
          if (!portalWrapper) createWrapperAndAppendToBody(popupPortalId);
      }
  }, [popupMessage]);

  const renderConfigs = (configs: ScrapeConfig[]) =>
      configs.map((config, i) => (
          <div key={i} style={{marginBottom: '1rem'}}>
            <div>Id: {config.id}</div>
            <div>Host: {config.host}</div>
            <div>Path: {config.path}</div>
            <div>Job anchor selector: {config.jobAnchorSelector}</div>
            <div>Job link contains: {config.jobLinkContains}</div>
            <div>Number of pages: {config.numberOfPages}</div>
            <div>Interval [ms]: {config.interval}</div>
            <button onClick={() => handleDeleteConfig(config.id)}>Delete config at Spring</button>
          </div>
      ));

  const renderJobGroups = (groupNames: string[]) =>
      groupNames.map((group, i) =>
          <button key={i} onClick={() => handleJobGroupChange(group)}>{group}</button>
      );

  const handleJobGroupChange = (group: string) => {
      setLoadingScreenshots(true);
      getJobsByGroup(group).then(resp => {
          if (resp.status === 200 && resp.data.data && resp.data.data.getScreenshotsByGroup && resp.data.data.getScreenshotsByGroup.files && resp.data.data.getScreenshotsByGroup.files.length) {
              setJobs(resp.data.data.getScreenshotsByGroup.files);
              setActiveGroup(group);
              setLoadingScreenshots(false);
          }
      });
  }

  const removeJob = (uuid: string) => {
      removeJobByGroupAndUuid(activeGroup, uuid).then(resp => {
          if (resp.status === 200 && resp.data.data && resp.data.data.removeScreenshotByGroupAndUuid && resp.data.data.removeScreenshotByGroupAndUuid.deleted) {
              getJobGroupNames().then(resp => {
                  if (resp.status === 200 && resp.data.data && resp.data.data.getGroupNames && resp.data.data.getGroupNames.names)
                      setGroupNames(resp.data.data.getGroupNames.names);
              });
          }
      });
    }

  const handleScrape = () => {
    scrape(host, path, jobAnchorSelector, jobLinkContains, parseInt(numberOfPages)).then(resp => {
      if (resp.status === 200 && resp.data.data && resp.data.data.scrape && resp.data.data.scrape.complete) alert('done!');
    }).catch(e => console.log(e));
  }

  const handleAddConfig = () => {
    persistScrapeConfig(host, path, jobAnchorSelector, jobLinkContains, parseInt(numberOfPages), parseInt(interval)).then(resp => {
      if (resp.status === 200 && resp.data.data && resp.data.data.addPage) setPopupMessage('Config added successfully');
    }).catch(e => console.log(e));
  }

  const handleDeleteConfig = (id: number) => {
    removeScrapeConfig(id).then(resp => {
      if (resp.status === 200 && resp.data.data && resp.data.data.addPage) {
          getScrapeConfigs().then(resp => {
              if (resp.status === 200 && resp.data.data && resp.data.data.getPages && resp.data.data.getPages.length)
                  setConfigs(resp.data.data.getPages);
              setPopupMessage('Config removed successfully');
          });
      }
    }).catch(e => console.log(e));
  }

  const handleModifyConfig = () => {
    modifyScrapeConfig(parseInt(id), host, path, jobAnchorSelector, jobLinkContains, parseInt(numberOfPages), parseInt(interval)).then(resp => {
        if (resp.status === 200 && resp.data.data && resp.data.data.modifyPage) setPopupMessage('Config modified successfully');
    }).catch(e => console.log(e));
  }
if (process.browser) console.log(document.getElementById(popupPortalId))
  return (
      <div className={styles.container}>
        <Head>
          <title>{'Job Scraper'}</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>

          Latest scrape performed at:
          <ApolloProvider client={apollo_client2}>
            <SpringServerHeartbeat />
          </ApolloProvider>

          Latest new job discovered:
          <ApolloProvider client={apollo_client}>
            <NodeServerHeartbeat />
          </ApolloProvider>

          <h2>Add/edit config:</h2>
          Id: <input type={'text'} onChange={e => setId(e.target.value)}/>
          Host: <input type={'text'} onChange={e => setHost(e.target.value)}/>
          Path: <input type={'text'} onChange={e => setPath(e.target.value)}/>
          Job anchor selector: <input type={'text'} onChange={e => setJobAnchorSelector(e.target.value)}/><br/>
          Job link contains: <input type={'text'} onChange={e => setJobLinkContains(e.target.value)}/>
          Number of pages: <input type={'text'} onChange={e => setNumberOfPages(e.target.value)}/>
          Interval [ms]: <input type={'text'} onChange={e => setInterval(e.target.value)}/><br/>
          <button onClick={handleScrape}>Scrape now!</button>
          <button onClick={handleAddConfig}>Add config</button>
          <button onClick={handleModifyConfig}>Modify config</button>

          <h2>Configs:</h2>
          {renderConfigs(configs)}

          <h2>Jobs:</h2>
          {renderJobGroups(groupNames)}

          <br/>
          <br/>
            {loadingScreenshots ? <span>Loading...</span> : process.browser && document.getElementById(galleryPortalId) && ReactDOM.createPortal(
                <ImageGallery
                    images={jobs.map(uuid => ({
                        src: `http://${NODE_SERVER_HOST}/screenshots/${activeGroup}/${uuid}.png`,
                        onDelete: () => removeJob(uuid)
                    }))}
                    disactive={() => {
                        setActiveGroup('')
                        setJobs([]);
                    }}
                />,
                document.getElementById(galleryPortalId)
            )}
            {popupMessage && process.browser && document.getElementById(popupPortalId) && ReactDOM.createPortal(
                <Popup
                    message={popupMessage}
                    onClose={() => setPopupMessage('')}
                />,
                document.getElementById(popupPortalId)
            )}

        </main>
      </div>
  )
}
