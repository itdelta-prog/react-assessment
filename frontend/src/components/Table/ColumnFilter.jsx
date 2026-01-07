import React, {Fragment, startTransition, useEffect, useState} from 'react';
import {Listbox, Transition} from '@headlessui/react';
import {CheckIcon, XIcon} from '@heroicons/react/solid';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function ColumnFilter({column}) {
    const {filterValue, setFilter} = column;

    return (
        <>
            <span className="mt-1 relative flex items-center">
            <input
                type="text"
                value={filterValue || ''}
                // placeholder='search...'
                onChange={(e) =>
                    startTransition(() => setFilter(e.target.value || undefined))
                }
                className="h-[34px] pl-1 pr-5 shadow-sm block w-full border border-gray-300 rounded-md
                    focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
            />
            {filterValue ? (
              <span
                  className="absolute inset-y-0 right-0 z-50 flex items-center pr-2"
                  onClick={() => {
                      setFilter();
                  }}>
                <XIcon className="cursor-pointer w-3 h-3 text-gray-500"/>
            </span>
            ) : null}
          </span>
        </>
    );
}

