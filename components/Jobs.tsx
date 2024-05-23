import React, {useEffect, useState} from "react";
import {ImageGallery} from "../components/ImageGallery";
import {
    getJobGroupNames,
    getJobsByGroup,
    removeJobByGroupAndUuid,
    removeJobGroupByName
} from "../requests";
import CardHOC from "./CardHOC";
import {PortalComponent} from "./PortalComponent";
import { selectJob } from "../redux/slices";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../redux/slices";

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
    const [galleryVisible, setGalleryVisible] = useState(true);

    const newJob = useSelector(selectJob);

    const dispatch = useDispatch();

    useEffect(() => {
        !process.env.NEXT_PUBLIC_LOCAL && getJobGroupNames(true, null, nodeServerHost).then(resp => {
            if (resp.status === 200 && resp.data.data && resp.data.data.getGroupNames && resp.data.data.getGroupNames.names) {
                const gn = resp.data.data.getGroupNames.names;
                setGroupNames(gn);
            }
        }).catch(e => console.log(e));
    }, [newJob]);

    const renderJobGroups = (groupNames: string[]) => (
        <ul>
            {groupNames && groupNames.map((group, i) => (
                <li key={`job-group-${i}`}>
                    <span className="lead d-inline-block" style={{width: '300px'}}>{group}</span>
                    <button className='btn btn-light mx-4' key={`view-${i}`} onClick={() => handleJobGroupChange(group)}>View jobs</button>
                    <button className='btn btn-light mx-4' key={`remove-${i}`} onClick={() => removeJobGroup(group)}>Remove all</button>
                </li>
            ))}
        </ul>
    );

    const handleJobGroupChange = (group: string) => {
        setLoadingScreenshots(true);
        dispatch(setLoading(true));
        if (process.env.NEXT_PUBLIC_LOCAL) {
            setJobs([
                {
                    name: 'field',
                    link: 'https://images.pexels.com/photos/388415/pexels-photo-388415.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
                },
                {
                    name: 'pengiun',
                    link: 'https://www.kaleidoscope.com.au/assets/full/FM3126.jpg?20210309030611'
                },
            ]);
            setActiveGroup(group);
            setLoadingScreenshots(false);
            dispatch(setLoading(false));
            setGalleryVisible(true);
        } else {
            getJobsByGroup(group, nodeServerHost).then(resp => {
                if (resp.status === 200 && resp.data.data && resp.data.data.getScreenshotsByGroup && resp.data.data.getScreenshotsByGroup.length) {
                    setJobs(resp.data.data.getScreenshotsByGroup);
                    setActiveGroup(group);
                    setLoadingScreenshots(false);
                    setGalleryVisible(true);  
                }
            }).catch(e => console.log(e))
            .finally(() => dispatch(setLoading(false)));
        }
    }

    const removeJobGroup = (groupName: string) => {
        dispatch(setLoading(true));
        removeJobGroupByName(groupName, nodeServerHost).then(resp => {
            if (resp.status === 200 && resp.data.data && resp.data.data.removeAllScreenshotsByGroup && resp.data.data.removeAllScreenshotsByGroup.deleted) {
                setPopupMessage(`All jobs of ${groupName} removed successfully`);
                getJobGroupNames(false, "", nodeServerHost).then(resp => {
                    if (resp.status === 200 && resp.data.data && resp.data.data.getGroupNames && resp.data.data.getGroupNames.names)
                        setGroupNames(resp.data.data.getGroupNames.names);
                });
            }
        }).catch(e => console.log(e))
        .finally(() => dispatch(setLoading(false)));
    }

    const removeJob = (uuid: string) => {
        dispatch(setLoading(true));
        removeJobByGroupAndUuid(activeGroup, uuid, nodeServerHost).then(resp => {
            if (resp.status === 200 && resp.data.data && resp.data.data.removeScreenshotByGroupAndUuid && resp.data.data.removeScreenshotByGroupAndUuid.deleted) {
                getJobGroupNames(false, "", nodeServerHost).then(resp => {
                    if (resp.status === 200 && resp.data.data && resp.data.data.getGroupNames && resp.data.data.getGroupNames.names)
                        setGroupNames(resp.data.data.getGroupNames.names);
                });
            }
        }).catch(e => console.log(e))
        .finally(() => dispatch(setLoading(false)));
    }

    const constructImageSrc = (job: { name: string, link: string }) => {
        if (process.env.NEXT_PUBLIC_LOCAL) {
            return job.link;
        } else {
            return `http://${nodeServerHost}/screenshots/${currentUserUuid}/${activeGroup}/${job.name}.png`;
        }
    }

    return (
        <section aria-label="Jobs">
            <button className="btn btn-light d-block my-2" data-bs-toggle="collapse" data-bs-target="#job-offers">
                Jobs
            </button>
            <div className="collapse" id="job-offers">
                <CardHOC title={<h3>Jobs:</h3>} body={renderJobGroups(groupNames)} />
            </div>

            <PortalComponent
                renderCondition={!loadingScreenshots && galleryVisible}
                rootElementId={'gallery-portal-container'}
                element={
                    <ImageGallery
                        images={jobs.map(job => ({
                            src: constructImageSrc(job),
                            onDelete: () => removeJob(job.name),
                            link: job.link
                        }))}
                        onClose={() => {
                            setActiveGroup('')
                            setJobs([]);
                            setGalleryVisible(false);
                        }}
                    />
                }
            />
        </section>
    );
};
