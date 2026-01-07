import React from "react";

const PriceCell = ({value}) => {
    return (
        <div className="text-sm font-medium">
            ${value?.toLocaleString()}
        </div>
    );
};


export default PriceCell;
