import React from 'react';

type Props = {
    style?: React.CSSProperties,
}

const LoadingBox: React.FC<Props> = ({style}) => {

    return (
        <div className="loading-box" style={style ?? {}} />
    );
};

export default LoadingBox;