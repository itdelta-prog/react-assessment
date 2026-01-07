import React from "react";

const TypeCell = ({value}) => {
  const paletteMap = {
    market: 'bg-blue-50 text-blue-600',
    crypto: 'bg-violet-50 text-violet-600',
    stocks: 'bg-emerald-50 text-emerald-600',
  }

  const fallbackStyle = 'bg-slate-100 text-slate-600'

  return (
      <span className={`text-xs px-2.5 py-1 rounded-lg font-medium capitalize ${paletteMap[value] || fallbackStyle}`}>
            {value || ""}
      </span>
  );
};


export default TypeCell;
