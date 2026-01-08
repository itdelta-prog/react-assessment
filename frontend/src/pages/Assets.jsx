import React, {startTransition, useEffect, useMemo, useState} from 'react'
import {getStocks, getCrypto, getAssets} from '../services/api'
import Table1 from "../components/Table/Table1";
import OneLineCell from "../components/Table/Cell/OneLineCell";
import {SelectFilter} from "../components/Table/Filters/SelectFilter";
import ColumnFilter from "../components/Table/Filters/ColumnFilter";
import TypeCell from "../components/Table/Cell/TypeCell";
import PriceCell from "../components/Table/Cell/PriceCell";
import ChangeCell from "../components/Table/Cell/ChangeCell";
import {XIcon} from "@heroicons/react/solid";
import ColumnCurrencyRangeFilter from "../components/Table/Filters/ColumnCurrencyRangeFilter";

const Assets = () => {
    const [searchFilter, setSearchFilter] = useState();

    useEffect(() => {

    }, [searchFilter]);

    const fetchData = async ({ pageIndex, pageSize, filters, sorting }) => {
        const sortBy = sorting?.sortBy ?? "";
        const sortDir = sorting?.sortDir ?? "";

        // prepare the query string
        let filtersQueryString = filters
            .map((n) => {
                const id = encodeURIComponent(n.id);
                const value = encodeURIComponent(n.value);

                if (n.id === 'symbol' || n.id === 'name'){
                    return `search=${n.value}`
                }
                else if (n.id === 'currentPrice') {
                    const val = JSON.parse(n.value);
                    return [val?.start && `minPrice=${val.start}`, !!val?.end && `maxPrice=${val.end}`].filter(x => x).join('&');
                }
                else if (n.id === 'changePercent') {
                    const val = JSON.parse(n.value);
                    return [val?.start && `minChangePercent=${val.start}`, !!val?.end && `maxChangePercent=${val.end}`].filter(x => x).join('&');
                }else {
                    return `${id}=${value}`;
                }
            })
            .join('&');

        if (!!searchFilter) filtersQueryString = `${filtersQueryString}&search=${encodeURIComponent(searchFilter)}`;

        const query = `?page=${pageIndex}&limit=${pageSize}&sort=${encodeURIComponent(sortBy) ?? ""}&order=${sortDir ?? ""}&${filtersQueryString}`;

        try {
            const res = await getAssets(query)

            if (!res?.data?.success) {
                throw new Error('API error')
            }
            return res;
        } catch (e) {
            console.error(e)
        }
    }

    const columns = useMemo(() => [
        {
            Header: "Symbol",
            accessor: "symbol",
            width: 120,
            Cell: OneLineCell,
            // Filter: ColumnFilter,
            disableFilters: true,
        },
        {
            Header: "Name",
            accessor: "name",
            width: 250,
            minWidth: 150,
            Cell: OneLineCell,
            // Filter: ColumnFilter,
            disableFilters: true,
        },
        {
            Header: "Price",
            accessor: "currentPrice",
            width: 250,
            minWidth: 150,
            Filter: ColumnCurrencyRangeFilter,
            Cell: PriceCell,
        },
        {
            Header: "Change",
            accessor: "changePercent",
            width: 250,
            minWidth: 150,
            Filter: ColumnCurrencyRangeFilter,
            Cell: ChangeCell,
        },
        {
            Header: "Volume",
            accessor: "volume",
            id: "minVolume",
            width: 250,
            minWidth: 150,
            Cell: PriceCell,
            placeholder: "Min volume..."
        },
        {
            Header: "Type",
            accessor: "assetType",
            id: "type",
            width: 250,
            minWidth: 150,
            disableSortBy: true,
            Cell: TypeCell,
            Filter: ({column}) =>
                <SelectFilter column={column} options={
                    ['stock', 'crypto'].map(value => ({
                        value: value,
                        label: value
                    }))
                }/>,
        },
    ]);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Assets</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <span className="flex items-center relative w-80 mb-2">
                    <input
                        type="text"
                        value={searchFilter || ''}
                        placeholder='Search Symbol or Name...'
                        onChange={(e) =>
                            startTransition(() => setSearchFilter(e.target.value || undefined))
                        }
                        className="h-[34px] px-2 shadow-sm block w-80 border border-gray-300 rounded-md
                            focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                    />
                    {searchFilter ? (
                        <div
                            className="absolute inset-y-0 right-0 z-50 flex items-center pr-2"
                            onClick={() => setSearchFilter('')}>
                        <XIcon className="cursor-pointer w-3 h-3 text-gray-500"/>
                        </div>
                    ) : null}
                </span>

                <Table1
                    columns={columns}
                    fetchData={fetchData}
                    topFilters={searchFilter}
                />
            </div>
        </div>
    )
}

export default Assets
