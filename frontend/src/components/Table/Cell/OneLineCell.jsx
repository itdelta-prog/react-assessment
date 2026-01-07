import React from "react";
const OneLineCell = ({value}) => {
  return (
    <div className="w-full text-left overflow-hidden whitespace-pre-line max-h-[78px] truncate">
      {value || ""}
    </div>
  );
};


export default OneLineCell;
