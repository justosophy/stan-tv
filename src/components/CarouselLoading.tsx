import React from 'react';

const CarouselLoading: React.FC = () => {
    const max = 5;

    const itemWindow = new Array(max).fill(null);

    return (
        <div
            className="carousel"
        >
            {itemWindow
                ?.map((_: any, index: number) => (
                    <a
                        key={index}
                    >
                        <div className="loading-placeholder"
                        />
                    </a>
                ))}
        </div>
    );
};

export default CarouselLoading;