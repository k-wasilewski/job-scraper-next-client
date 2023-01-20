import React, {useState} from "react";
import {ImageGallery} from "../components/ImageGallery";
import {
    getJobGroupNames,
    getJobsByGroup,
    NODE_SERVER_HOST,
    removeJobByGroupAndUuid,
    removeJobGroupByName
} from "../requests";
import CardHOC from "./CardHOC";
import {PortalComponent} from "./PortalComponent";

interface JobsProps {
    _groupNames: string[]
    setPopupMessage: (value: string) => void;
    currentUserUuid: string;
    nodeServerHost?: string;
    springServerHost?: string;
}

export const Jobs = (props: JobsProps) => {
    const { _groupNames, setPopupMessage, currentUserUuid, nodeServerHost, springServerHost } = props;

    const [groupNames, setGroupNames] = useState(_groupNames);
    const [activeGroup, setActiveGroup] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loadingScreenshots, setLoadingScreenshots] = useState(false);

    const renderJobGroups = (groupNames: string[]) => (
        <>
            {groupNames && groupNames.map((group, i) =>
                <button className='btn btn-light' key={i} onClick={() => handleJobGroupChange(group)}>{group}</button>
            )}
        </>
    );

    const renderDeleteJobGroup = (groupNames: string[]) => (
      <>
          {groupNames && groupNames.map((group, i) =>
              <button className='btn btn-light' key={i} onClick={() => removeJobGroup(group)}>{`Delete ${group}`}</button>
          )}
      </>
    );

    const handleJobGroupChange = (group: string) => {
        setLoadingScreenshots(true);
        getJobsByGroup(group, nodeServerHost).then(resp => {
            if (resp.status === 200 && resp.data.data && resp.data.data.getScreenshotsByGroup && resp.data.data.getScreenshotsByGroup.files && resp.data.data.getScreenshotsByGroup.files.length) {
                setJobs(resp.data.data.getScreenshotsByGroup.files);
                setActiveGroup(group);
                setLoadingScreenshots(false);
            }
        }).catch(e => console.log(e));
    }

    const removeJobGroup = (groupName: string) => {
        removeJobGroupByName(groupName, nodeServerHost).then(resp => {
            if (resp.status === 200 && resp.data.data && resp.data.data.removeAllScreenshotsByGroup && resp.data.data.removeAllScreenshotsByGroup.deleted) {
                setPopupMessage(`All jobs of ${groupName} removed successfully`);
                getJobGroupNames(false, "", nodeServerHost).then(resp => {
                    if (resp.status === 200 && resp.data.data && resp.data.data.getGroupNames && resp.data.data.getGroupNames.names)
                        setGroupNames(resp.data.data.getGroupNames.names);
                });
            }
        }).catch(e => console.log(e));
    }

    const removeJob = (uuid: string) => {
        removeJobByGroupAndUuid(activeGroup, uuid, nodeServerHost).then(resp => {
            if (resp.status === 200 && resp.data.data && resp.data.data.removeScreenshotByGroupAndUuid && resp.data.data.removeScreenshotByGroupAndUuid.deleted) {
                getJobGroupNames(false, "", nodeServerHost).then(resp => {
                    if (resp.status === 200 && resp.data.data && resp.data.data.getGroupNames && resp.data.data.getGroupNames.names)
                        setGroupNames(resp.data.data.getGroupNames.names);
                });
            }
        }).catch(e => console.log(e));
    }

    return (
        <>
            <CardHOC title={<h3>Delete jobs:</h3>} body={renderDeleteJobGroup(groupNames)} />

            <CardHOC title={<h3>Jobs:</h3>} body={renderJobGroups(groupNames)} />

            <br/>
            <br/>

            <PortalComponent
                renderCondition={!loadingScreenshots}
                rootElementId={'gallery-portal-container'}
                element={
                    <ImageGallery
                        images={jobs.map(uuid => ({
                            src: `http://${NODE_SERVER_HOST}/screenshots/${currentUserUuid}/${activeGroup}/${uuid}.png`,
                            onDelete: () => removeJob(uuid)
                        }))}
                        onClose={() => {
                            setActiveGroup('')
                            setJobs([]);
                        }}
                    />
                }
            />
        </>
    );
};
