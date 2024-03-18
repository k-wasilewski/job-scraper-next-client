import React, {useEffect, useState} from "react";
import {createWrapperAndAppendToBody} from "../utils/createPortal";
import ReactDOM from "react-dom";

interface PortalComponentProps {
    renderCondition?: boolean;
    rootElementId: string;
    element: JSX.Element;
}

export const PortalComponent = (props: PortalComponentProps) => {
    const { renderCondition, rootElementId, element } = props;

    const [portalRootElement, setPortalRootElement] = useState(
        process.browser ? document.getElementById(rootElementId) : null
    );

    useEffect(() => {
        if (renderCondition && process.browser) {
            if (portalRootElement === null) setPortalRootElement(createWrapperAndAppendToBody(rootElementId));
        }
    }, [renderCondition]);

    return (
        <>
            {renderCondition && process.browser && portalRootElement !== null && ReactDOM.createPortal(
                element,
                portalRootElement
            )}
        </>
    );
}