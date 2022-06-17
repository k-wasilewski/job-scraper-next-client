import React, {useEffect} from "react";
import {createWrapperAndAppendToBody} from "../utils/createPortal";
import ReactDOM from "react-dom";

interface PortalComponentProps {
    renderCondition?: boolean;
    rootElementId: string;
    element: JSX.Element;
}

export const PortalComponent = (props: PortalComponentProps) => {
    const { renderCondition, rootElementId, element } = props;

    const portalRootElement = process.browser ? document.getElementById(rootElementId) : null;

    useEffect(() => {
        if (renderCondition) {
            if (!portalRootElement) createWrapperAndAppendToBody(rootElementId);
        }
    }, [renderCondition]);

    return (
        <>
            {renderCondition && process.browser && portalRootElement && ReactDOM.createPortal(
                element,
                portalRootElement
            )}
        </>
    );
}