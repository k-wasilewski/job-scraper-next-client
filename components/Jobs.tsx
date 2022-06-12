import React, {useState} from "react";
import {ImageGallery} from "../components/ImageGallery";
import {
    getJobGroupNames,
    getJobsByGroup,
    NODE_SERVER_HOST,
    removeJobByGroupAndUuid,
    removeJobGroupByName
} from "../requests";

interface JobsProps {
    _groupNames: string[]
    setPopupMessage: (value: string) => void;
    currentUserUuid: string;
}

export const Jobs = (props: JobsProps) => {
    const { _groupNames, setPopupMessage, currentUserUuid } = props;

    const [groupNames, setGroupNames] = useState(_groupNames);
    const [activeGroup, setActiveGroup] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loadingScreenshots, setLoadingScreenshots] = useState(false);

    const renderJobGroups = (groupNames: string[]) => (
        <>
            {groupNames && groupNames.map((group, i) =>
                <button key={i} onClick={() => handleJobGroupChange(group)}>{group}</button>
            )}
        </>
    );

    const renderDeleteJobGroup = (groupNames: string[]) => (
      <>
          {groupNames && groupNames.map((group, i) =>
              <button key={i} onClick={() => removeJobGroup(group)}>{`Delete ${group}`}</button>
          )}
      </>
    );

    const handleJobGroupChange = (group: string) => {
        setLoadingScreenshots(true);
        getJobsByGroup(group).then(resp => {
            if (resp.status === 200 && resp.data.data && resp.data.data.getScreenshotsByGroup && resp.data.data.getScreenshotsByGroup.files && resp.data.data.getScreenshotsByGroup.files.length) {
                setJobs(resp.data.data.getScreenshotsByGroup.files);
                setActiveGroup(group);
                setLoadingScreenshots(false);
            }
        }).catch(e => console.log(e));
    }

    const removeJobGroup = (groupName: string) => {
        removeJobGroupByName(groupName).then(resp => {
            if (resp.status === 200 && resp.data.data && resp.data.data.removeAllScreenshotsByGroup && resp.data.data.removeAllScreenshotsByGroup.deleted) {
                setPopupMessage(`All jobs of ${groupName} removed successfully`);
                getJobGroupNames().then(resp => {
                    if (resp.status === 200 && resp.data.data && resp.data.data.getGroupNames && resp.data.data.getGroupNames.names)
                        setGroupNames(resp.data.data.getGroupNames.names);
                });
            }
        }).catch(e => console.log(e));
    }

    const removeJob = (uuid: string) => {
        removeJobByGroupAndUuid(activeGroup, uuid).then(resp => {
            if (resp.status === 200 && resp.data.data && resp.data.data.removeScreenshotByGroupAndUuid && resp.data.data.removeScreenshotByGroupAndUuid.deleted) {
                getJobGroupNames().then(resp => {
                    if (resp.status === 200 && resp.data.data && resp.data.data.getGroupNames && resp.data.data.getGroupNames.names)
                        setGroupNames(resp.data.data.getGroupNames.names);
                });
            }
        }).catch(e => console.log(e));
    }

    return (
        <>
            <h2>Delete jobs:</h2>
            {renderDeleteJobGroup(groupNames)}

            <h2>Jobs:</h2>
            {renderJobGroups(groupNames)}

            <br/>
            <br/>

            <ImageGallery
                images={jobs.map(uuid => ({
                    src: `http://${NODE_SERVER_HOST}/screenshots/${currentUserUuid}/${activeGroup}/${uuid}.png`,
                    onDelete: () => removeJob(uuid)
                }))}
                disactive={() => {
                    setActiveGroup('')
                    setJobs([]);
                }}
                loading={loadingScreenshots}
            />
        </>
    );
};