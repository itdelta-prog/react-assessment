import React, {useEffect, useState} from "react";
import {AsyncPaginate} from "react-select-async-paginate";
import {useTranslation} from "react-i18next";

export function AsyncSelectFilter({column, loadOptions}) {
  const { t } = useTranslation(["common", "access"]);
  const {filterValue} = column;
  const [value, setValue] = useState(''); // for restoring the filter value

  const customStyles = {
    control: (styles) => ({ ...styles, height: "34px", minHeight: "34px" }),
    indicatorsContainer: (styles) => ({ ...styles, height: "34px", minHeight: "34px" }),
    menuList: (styles) => ({
      ...styles,
      minHeight: "200px",
      overflowY: "auto",
  })
  };

  useEffect(() => {
    setValue(filterValue ? JSON.parse(window.localStorage.getItem("filters_asp_" + window.location.pathname)) : '');
  }, [filterValue]);


  return (
    <>
        <span className="mt-1 relative flex items-center">
          <AsyncPaginate
            noOptionsMessage={() => t("access:noOptions")}
            loadingMessage={() => t("access:loading")}
            className='w-full overflow-visible shadow-sm block border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-xs h-[34px]'
            placeholder=''
            maxMenuHeight={400}
            menuPlacement="auto"
            defaultOptions
            loadOptions={loadOptions}
            debounceTimeout={500}
            additional={{page: 1}}
            value={value}
            onChange={(e) => {
              setValue(e) // local state
              window.localStorage.setItem("filters_asp_" + window.location.pathname, JSON.stringify(e));
              column.setFilter(e?.value) // table filter
            }}
            isClearable
            styles={customStyles}
            classNamePrefix={'async-select'}
            menuPosition="fixed"
          />
      </span>
    </>

  )
}

