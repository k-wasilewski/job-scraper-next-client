import React, { ReactNode } from "react";

interface CardHOCProps {
    title: ReactNode;
    body: ReactNode;
    className?: string;
}

const CardHOC = (props: CardHOCProps) => {
    const {title, body, className} = props;

    return (
        <div className={'card m-2 ' + (className || '')}>
            <div className="card-body">
                <div className="card-title">
                    {title}
                </div>
                <div className="card-text">
                    {body}
                </div>
            </div>
        </div>
    );
}

export default CardHOC;