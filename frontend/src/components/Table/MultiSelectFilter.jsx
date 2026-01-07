import { Fragment, useState } from 'react';

import { Listbox, Transition } from '@headlessui/react';

import { ChevronDownIcon, XIcon, CheckIcon } from '@heroicons/react/solid';

import clsx from 'clsx';

/**
 * Множественный фильтр для таблицы с выбором нескольких опций.
 *
 * @param {Object} props - Свойства компонента.
 * @param {Object} props.column - Колонка таблицы, в которую встроен фильтр.
 * @param {Function} props.column.setFilter - Функция установки фильтра для колонки.
 * @param {Array<{ value: string|number, label: string }>} props.options - Список доступных опций для выбора.
 *
 * @returns {JSX.Element} JSX-элемент мультиселекта для фильтрации.
 */

const MultiSelectFilter = ({ column: { filterValue = [], setFilter }, options }) => {

  const toggleOption = (value) => {
    const exists = filterValue.includes(value);
    const newValue = exists
      ? filterValue.filter((v) => v !== value)
      : [...filterValue, value];

    setFilter(newValue.length > 0 ? newValue : undefined);
  };

  const clear = (e) => {
    e.preventDefault();
    setFilter(undefined);
  };

  return (
    <Listbox value={filterValue} onChange={toggleOption}>
      {({ open }) => (
        <div className="mt-1 relative flex w-full max-w-xs">
          <Listbox.Button className="relative w-full h-[34px] bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-1 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
            <span className="block truncate">
              {filterValue.length > 0
                ? `Фильтров: ${filterValue.length}`
                : 'Выбрать...'}
            </span>
            {filterValue.length > 0 ? (
              <span
                className="absolute inset-y-0 right-0 z-50 flex items-center pr-2"
                onClick={clear}>
                <XIcon className="cursor-pointer w-3 h-3 text-gray-600" />
              </span>
            ) : (
              <span className="absolute inset-y-0 right-0 z-50 flex items-center pr-2">
                <ChevronDownIcon className="cursor-pointer w-3 h-3 text-gray-600" />
              </span>
            )}
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm top-8">
              {options?.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    clsx(
                      active ? 'bg-indigo-100' : '',
                      'cursor-default select-none relative flex justify-between items-center px-2 py-1 text-xs',
                    )
                  }>
                  <span>{option.label}</span>
                  {filterValue.includes(option.value) && (
                    <CheckIcon className="w-4 h-4 text-indigo-500" />
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};

export default MultiSelectFilter;
