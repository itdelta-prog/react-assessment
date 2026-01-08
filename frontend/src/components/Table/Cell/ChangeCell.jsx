import React from "react";

const ChangeCell = ({value}) => {
  const directionFlag = value > 0;
  return (
      <div
          className={`text-xs font-medium ${
              directionFlag ? 'text-emerald-600' : 'text-rose-600'
          }`}
      >
        {directionFlag && '+'}
        {value?.toFixed(2)}%
      </div>
  );
};

export default ChangeCell;
