import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  useRowSelect,
  useResizeColumns,
  useFlexLayout,
  useExpanded,
} from "react-table";
import {
  SortAscendingIcon,
  SortDescendingIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SelectorIcon,
  CheckIcon,
  CogIcon
} from "@heroicons/react/outline";
import { useTranslation } from "react-i18next";
import { Listbox, Transition } from "@headlessui/react";
import LoadingSpinner from "../LoadingSpinner";
import ColumnFilter from "./Filters/ColumnFilter.jsx";

export default function Table1({
  columns,
  addActions,
  renderRowSubComponent,
  refresh,
  dataValue,
  additionalButton,
  defaultSortField, // field to sort
  defaultSortDesc = true, //prop for managing the sorting state
  tableFiltersExpanded = true, // show filters opened
  topFilters, // additional filters above the table
  fetchData,
  ...props
}) {
  const { t } = useTranslation(["common", "table"]);

  const [loading, setLoading] = useState(false);
  const [controlledPageCount, setControlledPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState(dataValue ?? []);
  const tableRef = useRef();

  const [inputFilter, setInputFilter] = useState(() => {
    const storedValue = localStorage.getItem(`tableFilterExpanded_${window.location.pathname}`) ?? tableFiltersExpanded;
    return storedValue === null ? true : storedValue === 'true';
  });

  const getSavedSortBy = () => {
    const savedSortBy = window.localStorage.getItem("sortBy_" + window.location.pathname);
    return savedSortBy ? JSON.parse(savedSortBy) : [];
  };

  const initialSortBy = useMemo(() => {
    const savedSortBy = getSavedSortBy();

    //first sort from localStorage
    if (savedSortBy.length > 0) {
      return savedSortBy;
    }

    //after sort from props
    if (defaultSortField) {
      return [{ id: defaultSortField, desc: defaultSortDesc }];
    }

    //finally value
    return [];
  }, [defaultSortField, defaultSortDesc]);

  const normalizedColumns = useMemo(() => {
    return columns
      .map((col) => {
        const accessorIsString = typeof col.accessor === 'string';

        return {
          id: accessorIsString ? col.accessor : col.id,
          ...col,
        };
      })
      .filter((col) => col.id);
  }, [columns]);

  const [columnOrder, setColumnOrder] = useState(() =>
    JSON.parse(localStorage.getItem("columnOrder_" + window.location.pathname)) || normalizedColumns.map(col => col.id)
  );

  const sortedColumns = useMemo(() => {
    return columnOrder
      .map(id => normalizedColumns.find(col => col.id === id))
      .filter(Boolean);
  }, [columnOrder, normalizedColumns]);

  // Column settings modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    showFilter = false,
    pageSizes = null,
    manualSortBy = true,
    outsideFilters = null
  } = props;

  const showElementsPerPage = props?.options?.showElementsPerPage ?? true;
  const showPagination = props?.options?.showPagination ?? true;

  const defaultColumn = useMemo(() => ({
      minWidth: 80,
      width: 150,
      maxWidth: 400,
      // DefaultFilter
      Filter: ColumnFilter,
      // Cell: EditableCell
    }),
    []
  );

  const checkboxColumn = useMemo(
    () => ({
      id: 'selection',
      Header: ({ getToggleAllRowsSelectedProps }) => (
        <div>
          <IndeterminateCheckbox {...getToggleAllRowsSelectedProps({ title: t('table:tooltipToggleAll') })} />
        </div>
      ),
      Cell: ({ row }) => (
        <div>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps({ title: t('table:tooltipToggleRow') })} />
        </div>
      ),
      minWidth: 30,
      disableSortBy: true,
      disableFilters: true,
      headerCenter: true,
      width: 30,
      disableResizing: true,
      showOverflow: true
    }), []
  )

  const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef();
      const resolvedRef = ref || defaultRef;

      useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
      }, [resolvedRef, indeterminate]);

      return (
        <>
          <input type="checkbox" ref={resolvedRef} {...rest} />
        </>
      );
    }
  );

  const getSavedHiddenColumns = () => {
    const savedHiddenColumns = window.localStorage.getItem(
      "hiddenColumns_" + window.location.pathname
    );
    if (savedHiddenColumns) {
      return JSON.parse(savedHiddenColumns);
    }
    return [];
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,

    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    preFilteredRows,
    allColumns,
    visibleColumns,
    getToggleHideAllColumnsProps,
    state,
    state: { pageIndex, pageSize, expanded, filters, selectedRowIds, hiddenColumns, sortBy },

    selectedFlatRows,
    setGlobalFilter,
    setFilter,
    setAllFilters,
    setHiddenColumns
  } = useTable(
    {
      columns: sortedColumns,
      data,
      defaultColumn,

      initialState: {
        pageIndex:
          JSON.parse(
            window.localStorage.getItem("pageIndex_" + window.location.pathname)
          ) ?? 0,
        pageSize:
          JSON.parse(
            window.localStorage.getItem("pageSize_" + window.location.pathname)
          ) ?? 10,
        sortBy: initialSortBy,
        filters:
          JSON.parse(
            window.localStorage.getItem("filters_" + window.location.pathname)
          ) ?? [],
        hiddenColumns: ['selection', ...getSavedHiddenColumns()],
      },
      manualPagination: controlledPageCount !== null,
      pageCount: controlledPageCount,

      disableMultiSort: true,
      manualSortBy,
      autoResetSortBy: false,
      manualFilters: true,
      autoResetSelectedRows: false,
      getRowId: (row) => row?.id
    },
    // useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    useFlexLayout,
    useResizeColumns,
    hooks => {
        hooks.visibleColumns.push(columns => [checkboxColumn, ...columns])
    }
  );

  const [sorting, setSorting] = useState({
    sortBy: state.sortBy[0]?.id,
    sortDir: state.sortBy[0]?.desc ? "desc" : "asc",
  });

  // fetching data
  useEffect(() => {
    if (dataValue == null && loading !== true) {
      setLoading(true);
      fetchData({ pageIndex: pageIndex + 1, pageSize, filters, sorting })
          .then(resp => {
            setTotal(resp.data.pagination.totalItems);
            setControlledPageCount(resp.data.pagination.totalPages);
            setData(resp.data.data);
          })
          .finally(() => setLoading(false));
    }
    window.localStorage.setItem("pageSize_" + window.location.pathname, pageSize);
    window.localStorage.setItem("filters_" + window.location.pathname, JSON.stringify(filters));

  }, [pageSize, pageIndex, filters, sorting, refresh, topFilters]);

  // reset page after changing filters or sorting
  useEffect(() => {
    gotoPage(0);
  }, [filters, sorting]);

  // sorting
  useEffect(() => {
    window.localStorage.setItem(
      "sortBy_" + window.location.pathname,
      JSON.stringify(state.sortBy)
    );
    let sortBy, sortDir;
    if (state.sortBy.length) {
      sortBy = state.sortBy[0]?.id;
      sortDir = state.sortBy[0]?.desc ? "desc" : "asc";
    }
    setSorting({ sortBy, sortDir });
  }, [state.sortBy[0]?.desc, state.sortBy[0]?.id]);

  const SortingIndicator = useCallback(({ column, className }) => {
    if (column.isSorted) {
      if (column.isSortedDesc) {
        return <SortDescendingIcon className={className} />;
      }
      return <SortAscendingIcon className={className} />;
    }

    return <SelectorIcon className={`${className} text-gray-300`} />;
  }, []);

  const Pagination = useCallback(() => {
    const NumberOfElementsSelector = ({ buttonTestId }) => {
      const pSizes = pageSizes ? pageSizes : [3, 10, 25, 50, 100];

      function getNoun(number, one, two, five) {
        let n = Math.abs(number);
        n %= 100;
        if (n >= 5 && n <= 20) {
          return five;
        }
        n %= 10;
        if (n === 1) {
          return one;
        }
        if (n >= 2 && n <= 4) {
          return two;
        }
        return five;
      }

      const getLocalizedNumberOfElements = (number) => {
        return getNoun(
          number,
          'element',
            'elements',
            'elements',
        );
      };

      return (
        <Listbox
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e));
            gotoPage(0);
          }}
        >
          {({ open }) => (
            <>
              <div className="relative flex items-center min-w-[220px]">
                <Listbox.Button
                  data-test-id={buttonTestId}
                  className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <span className="block truncate">
                    {`${t(
                      "Show"
                    )} ${pageSize} ${getLocalizedNumberOfElements(pageSize)}`}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <SelectorIcon
                      className="h-5 w-5 text-gray-600"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm bottom-8">
                    {pSizes.map((pSize, i) => (
                      <Listbox.Option
                        key={`pSize${i === pSizes.length - 1 ? `All` : pSize}`}
                        className={({ active }) =>
                          `${
                            active ? "bg-gray-200" : "text-gray-900"
                          } cursor-default select-none relative py-2 pl-8 pr-4`
                        }
                        value={pSize}
                      >
                        {() => (
                          <>
                            <span
                              className={`${
                                pageSize === pSize
                                  ? "font-semibold"
                                  : "font-normal"
                              } block truncate text-xs'`}
                            >
                              {`${t(
                                "Show"
                              )} ${pSize} ${getLocalizedNumberOfElements(
                                pSize
                              )}`}
                            </span>

                            {pageSize === pSize ? (
                              <span
                                className={`${
                                  pageSize === pSize
                                    ? "text-gray-600"
                                    : "text-indigo-600"
                                } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      );
    };

    return (
      <div className="flex items-center justify-between min-w-full">
        <div className="flex-1 flex flex-wrap justify-between sm:hidden">
          {showElementsPerPage && (
            <div className="w-full flex justify-center mb-2">
              <NumberOfElementsSelector />
            </div>
          )}
          <div className="w-full flex justify-between">
            <button
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={previousPage}
              disabled={!canPreviousPage}
              key="buttonPrev"
            >
              Previous
            </button>
            <button
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={nextPage}
              disabled={!canNextPage}
              key="buttonNext"
            >
              Next
            </button>
          </div>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          {showElementsPerPage && (
            <NumberOfElementsSelector buttonTestId="pageCountButton" />
          )}
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={previousPage}
                disabled={!canPreviousPage}
                key="prev"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
              {pageOptions.map((item) => {
                if (
                  item === 0 ||
                  item === pageCount - 1 ||
                  item === pageIndex - 1 ||
                  item === pageIndex ||
                  item === pageIndex + 1
                ) {
                  return (
                    <button
                      className={`${
                        item === pageIndex
                          ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                          : "border-gray-300 text-gray-500 hover:bg-gray-50"
                      }
                            relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white`}
                      key={`paginationItem${item}`}
                      onClick={() => gotoPage(item)}
                    >
                      {item + 1}
                    </button>
                  );
                }
                if (item === pageIndex - 2 || item === pageIndex + 2) {
                  return (
                    <button
                      className="border-gray-300 text-gray-500 relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white"
                      key={`dots${item}`}
                    >
                      ...
                    </button>
                  );
                }
                return null;
              })}
              <button
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={nextPage}
                disabled={!canNextPage}
                key="next"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  });

  const handleShowInput = () => {
    const newValue = !inputFilter;
    localStorage.setItem(`tableFilterExpanded_${window.location.pathname}`, newValue);
    setInputFilter(newValue);
  };

  // set the filters from a parent component for PS user search page
  useEffect(() => {
    if (outsideFilters) setFilter(outsideFilters.id, outsideFilters.value);
  }, [outsideFilters]);


  return (
      <div className="flex flex-col">

        {/*Filter button*/}
        <div className="flex justify-end pb-2">
          {additionalButton}
          {showFilter &&
            <FilterButton
              onClick={handleShowInput}
              onClear={() => setAllFilters([])}
              filters={filters}
              tooltip={t("common:filter")}
            />
          }
        </div>

        <div className="-my-2 sm:-mx-5 min-h-[200px] overflow-x-auto overflow-y-visible lg:-mx-[23px] mb-3">
          <div className="py-2 align-middle inline-block min-w-full lg:px-6">
            <div className="shadow  border-b border-gray-200 sm:rounded-lg">
              <table
                ref={tableRef}
                {...getTableProps()}
                className="w-full divide-y divide-gray-200"
              >
                <thead className="bg-gray-100 ">
                  {headerGroups.map((headerGroup, idx) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                      {headerGroup.headers.map((column, idx) => {
                        const isRowActionColumn = column.id === "rowActions" || column.accessor === "rowActions";
                        const getSortByToggleProps = {
                          ...column.getSortByToggleProps(),
                        }

                        const isSettings = column.id === "rowActions";
                        return (
                          <th
                            scope="col"
                            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider ${column.id === 'selection' ? 'flex' : ''} ${column.id === 'rowActions' ? 'flex ' : ''}`}
                            {...column.getHeaderProps()}
                            key={idx}
                          >
                            <div
                              className={`${
                                column.headerCenter === true
                                  ? "justify-center "
                                  : ""
                              } flex items-center`}
                              style={{width: '100%'}}
                              {...(column.disableSortBy
                                ? null
                                : getSortByToggleProps)}
                              title={t("table:ToggleSortBy")}
                            >
                              <span className="w-full justify-between flex items-center uppercase">
                                <span className={`flex text-ellipsis ${column.showOverflow ? '' : 'overflow-hidden'}`}>
                                {column.render("Header")}
                                {!column.disableSortBy ? (
                                  <SortingIndicator
                                    column={column}
                                    className={`shrink-0 w-4 h-4`}
                                  />
                                ) : null}
                                </span>

                                {isSettings && (
                                  <button
                                    className="text-sm hover:text-blue-700 flex m-auto items-center justify-center"
                                    onClick={() => setIsModalOpen(true)}
                                    title={t("table:columns")}
                                  >
                                    <CogIcon className="h-5 w-5" aria-hidden="true" />
                                  </button>
                                )}
                              </span>
                            </div>
                            {!column.disableFilters ? (
                              // <CSSTransition
                              //   in={inputFilter}
                              //   classNames="alert"
                              //   timeout={10}
                              //   unmountOnExit
                              // >
                                <div>
                                  {column.canFilter ? column.render("Filter") : null}
                                </div>
                              // </CSSTransition>
                            ) : (
                              ""
                            )}

                            {column.disableResizing !== true &&
                            headerGroup.headers.length !== idx + 1 ? (
                              <div
                                className={`resizer isResizing`}
                                {...(column.staticColumn !== true
                                  ? { ...column.getResizerProps() }
                                  : null)}
                              />
                            ) : null}

                            {column.separatorShow && (<div className={"resizer isResizing"} />)}

                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                  {
                    // Loop over the table rows
                    loading ? (
                      <tr className="h-24 flex justify-center items-center">
                        <td>
                          <LoadingSpinner />
                        </td>
                      </tr>
                    ) : (
                      page.length ?
                      page.map((row, i) => {
                        // Prepare the row for display
                        prepareRow(row);
                        return (
                          <React.Fragment key={i}>
                            <tr
                              className={`${
                                i % 2 === 0 ? "bg-white" : "bg-gray-50"
                              } border-b border-gray-300 text-sm`}
                              // className="bg-white "
                              {...row.getRowProps()}
                              key={{i}}
                            >
                              {
                                // Loop over the rows cells
                                row.cells.map((cell, idx) => {
                                  // Apply the cell props
                                  return (
                                    <th
                                      className={`py-3 font-medium flex break-all items-center ${row.id === 'selection' ? 'px-3' : 'px-6'}`}
                                      // className={`p-2 whitespace-no  wrap text-sm text-gray-500 justify-center ${idx === row.cells.length - 1 ? '' : 'border-r'} border-gray-300 flex flex-wrap items-center overflow-hidden`}
                                      {...cell.getCellProps()}
                                      key={idx}
                                    >
                                      {cell.render("Cell")}
                                    </th>
                                  );
                                })
                              }
                            </tr>
                            {/* subComponent */}
                            {row.isExpanded ? (
                              <tr>
                                <td colSpan={visibleColumns.length}>
                                  {renderRowSubComponent({ row })}
                                </td>
                              </tr>
                            ) : null}
                          </React.Fragment>
                        );
                      })
                        :(
                          <tr className="h-24 flex justify-center items-center">
                            <td>
                              no data...
                            </td>
                          </tr>
                        )
                    )
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* <div className="px-2 pt-3 flex flex-wrap items-center justify-center sm:justify-between w-full space-y-2 sm:space-y-0">
        {showColumnSelection && <VisibleColumnsSelector/>}
      </div> */}
        {showPagination && (
          <div className="px-2 py-3 flex flex-wrap items-center justify-center w-full space-y-2 mb-2">
            <Pagination />
          </div>
        )}

      </div>
  );
}
