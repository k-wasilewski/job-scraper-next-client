import React, {useEffect, useLayoutEffect, useRef} from "react";
import ReactDOM from "react-dom";
import {createWrapperAndAppendToBody} from "../utils/createPortal";

interface PopupProps {
    message: string;
    onClose: () => void;
}

export const Popup = (props: PopupProps) => {
    const { message, onClose } = props;

    const popupRef = useRef<HTMLDivElement>();
    const popupPortalId = 'popup-portal-container';

    useLayoutEffect(() => {
        window.addEventListener('click', (e: MouseEvent) => {
            const targetElement = e.target as HTMLElement;
            if (popupRef.current && !popupRef.current.contains(targetElement)) {
                onClose();
            }
        });
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        });
    }, [onClose]);

    useEffect(() => {
        if (message) {
            const portalWrapper = document.getElementById(popupPortalId);
            if (!portalWrapper) createWrapperAndAppendToBody(popupPortalId);
        }
    }, [message]);

    const popupContent = (
        <div style={{backgroundColor: 'rgba(0, 0, 0, 0.7)', minHeight: '100vh'}}>
            <div style={{position: 'absolute', top: '30%', left: '40vw'}}>
                <div ref={popupRef} style={{backgroundColor: 'white', height: '3rem', width: '20vw', textAlign: 'center', display: 'table-cell', verticalAlign: 'middle'}}>
                    {message}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {message && process.browser && document.getElementById(popupPortalId) && ReactDOM.createPortal(
                popupContent,
                document.getElementById(popupPortalId)
            )}
        </>
    );
}