import React, {startTransition, useState} from "react";
import {XIcon} from "@heroicons/react/solid";

const parseValue = (val) => {
    let parsedValue = {
        start: null,
        end: null
    };
    try {
        parsedValue = JSON.parse(filterValue);
    } catch (e) {
    }
    return parsedValue;
}

export default function ColumnCurrencyRangeFilter({column}) {
    const {setFilter, filterValue} = column;

    const [parsedValue, setParsedValue] = useState(() => parseValue(filterValue));

    const setDataFilter = (data) => {
        localStorage.setItem(
            "filters_" + window.location.pathname,
            JSON.stringify({
                start: data.start ?? null,
                end: data.end ?? null,
            }));
        setParsedValue(data);
        setFilter(JSON.stringify(data));
    };

    return (
        <>
            <span className="mt-1 flex items-center">
                <div className={"mr-3 relative"}>
                    <input
                        type="text"
                        value={parsedValue.start || ''}
                        placeholder='Min value...'
                        onChange={(e) =>
                            startTransition(() => setDataFilter({
                                start: e.target.value || undefined,
                                end: parsedValue.end
                            }))
                        }
                        className="h-[34px] pl-1 pr-5 shadow-sm block w-full border border-gray-300 rounded-md
                            focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                    />
                            {parsedValue.start ? (
                                <span
                                    className="absolute inset-y-0 right-0 z-50 flex items-center pr-2"
                                    onClick={() => {
                                        setDataFilter({
                                            start: undefined,
                                            end: parsedValue.end
                                        })
                                    }}>
                            <XIcon className="cursor-pointer w-3 h-3 text-gray-500"/>
                        </span>
                            ) : null}
                </div>

                <div className={"mr-3 relative"}>
                    <input
                        type="text"
                        value={parsedValue.end || ''}
                        placeholder='Max value...'
                        onChange={(e) =>
                            startTransition(() => setDataFilter({
                                start: parsedValue.start,
                                end: e.target.value || undefined,
                            }))
                        }
                        className="h-[34px] pl-1 pr-5 shadow-sm block w-full border border-gray-300 rounded-md
                            focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                    />
                        {parsedValue.end ? (
                            <span
                                className="absolute inset-y-0 right-0 z-50 flex items-center pr-2"
                                onClick={() => {
                                    setDataFilter({
                                        start: parsedValue.start,
                                        end: undefined,
                                    })
                                }}>
                            <XIcon className="cursor-pointer w-3 h-3 text-gray-500"/>
                        </span>
                        ) : null}
                </div>
          </span>
        </>
    );
}
