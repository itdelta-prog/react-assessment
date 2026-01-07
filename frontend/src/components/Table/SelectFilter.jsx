import React, {Fragment} from "react";
import {useTranslation} from "react-i18next";
import {Listbox, Transition} from "@headlessui/react";
import {clsx} from "clsx";
import {ChevronDownIcon, XCircleIcon, XIcon} from "@heroicons/react/outline";

/**
 * SelectFilter component for filtering data using a dropdown list.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.column - Column object containing filtering data.
 * @param {string} [props.column.filterValue] - Current filter value.
 * @param {Function} props.column.setFilter - Function to update the filter value.
 * @param {Array<{ value: string, label: string }>} props.options - List of selectable options.
 * 
 * @returns {JSX.Element} The rendered SelectFilter component.
 */

export function SelectFilter({column: { filterValue = "", setFilter }, options}) {
  const selected = options.find(({value}) => value === filterValue);

  const onSelectChange = (e) => {
    setFilter(e || undefined);
  };

  const drop = (e) => {
    e.preventDefault();
    setFilter(undefined);
  }

  return (
    <Listbox value={filterValue} onChange={onSelectChange}>
      {({open}) => (
        <div className="mt-1 relative flex w-full">

          <Listbox.Button
            className="relative w-full h-[34px] bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                    <span className="block truncate">
                        {selected?.label}
                    </span>
            {filterValue ? (
              <span className="absolute inset-y-0 right-0 z-50 flex items-center pr-2" onClick={drop}>
                <XIcon className='cursor-pointer w-3 h-3 text-gray-600'/>
              </span>
            ) : (
              <span className="absolute inset-y-0 right-0 z-50 flex items-center pr-2">
                <ChevronDownIcon className='cursor-pointer w-3 h-3 text-gray-600'/>
              </span>
            )}
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm top-8">
              {options.map(option => {
                if (!option) return null;
                return (
                  <Listbox.Option
                    key={option.label}
                    className={({active}) => clsx(active ? 'font-semibold bg-gray-200' : 'font-normal text-gray-900',
                      'cursor-default select-none relative flex justify-left p-1')}
                    value={option.value}
                  >
                    <span className={clsx('truncate text-xs flex justify-start')}>
                        {option.label}
                    </span>
                  </Listbox.Option>
                )
              })}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}

/**
 * ActivityFilter component that provides a dropdown filter for active/inactive states.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.column - Column object containing filtering data.
 * 
 * @returns {JSX.Element} The rendered ActivityFilter component.
 */

export function ActivityFilter({column}) {
  const {t} = useTranslation('common')
  const options = [
    {
      value: 'active',
      label: t('state.active')
    }, {
      value: 'inactive',
      label: t('state.inactive')
    }
  ]
  return <SelectFilter column={column} options={options}/>
}

/**
 * ActivityFilterBinary component that provides a dropdown filter for binary active/inactive states.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.column - Column object containing filtering data.
 * 
 * @returns {JSX.Element} The rendered ActivityFilterBinary component.
 */

export function ActivityFilterBinary({column}) {
  const {t} = useTranslation('common')
  const options = [
    {
      value: '1',
      label: t("common:active")
    }, {
      value: '0',
      label: t("common:inactive")
    }
  ]
  return <SelectFilter column={column} options={options}/>
}
