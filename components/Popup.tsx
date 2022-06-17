import React, {useLayoutEffect, useRef} from "react";

interface PopupProps {
    message: string;
    onClose: () => void;
}

export const Popup = (props: PopupProps) => {
    const { message, onClose } = props;

    const popupRef = useRef<HTMLDivElement>();

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

    return (
        <div style={{backgroundColor: 'rgba(0, 0, 0, 0.7)', minHeight: '100vh'}}>
            <div style={{position: 'absolute', top: '30%', left: '40vw'}}>
                <div ref={popupRef} style={{backgroundColor: 'white', height: '3rem', width: '20vw', textAlign: 'center', display: 'table-cell', verticalAlign: 'middle'}}>
                    {message}
                </div>
            </div>
        </div>
    );
}