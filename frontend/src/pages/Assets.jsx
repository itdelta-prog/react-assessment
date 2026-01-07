import {useEffect, useMemo, useState} from 'react'
import {getStocks, getCrypto} from '../services/api'
import Table1 from "../components/Table/Table1";
import OneLineCell from "../components/Table/Cell/OneLineCell";
import {SelectFilter} from "../components/Table/SelectFilter";
import ColumnFilter from "../components/Table/ColumnFilter";
import TypeCell from "../components/Table/Cell/TypeCell";
import PriceCell from "../components/Table/Cell/PriceCell";
import ChangeCell from "../components/Table/Cell/ChangeCell";

const Assets = () => {
    const fetchData = async ({ pageIndex, pageSize, filters, sorting }) => {
        const sortBy = sorting?.sortBy ?? "";
        const sortDir = sorting?.sortDir ?? "";

        const filtersArr = filters
            .map((n) => {
                return `${encodeURIComponent(n.id)}=${encodeURIComponent(
                    n.value,
                )}`;
            })
            .join('&');
        const query = `?page=${pageIndex}&limit=${pageSize}&sort=${encodeURIComponent(sortBy) ?? ""}&order=${sortDir ?? ""}&${filtersArr}`;

        try {
            const [stocks, crypto] = await Promise.all([
                getStocks(query).then(response => response.data),
                getCrypto(query).then(response => response.data),
            ])

            const merged = [
                ...(stocks ?? []).map(a => ({...a, type: 'stock'})),
                ...(crypto ?? []).map(a => ({...a, type: 'crypto'})),
            ]

            return merged;
        } catch (e) {
            console.error(e)
        }
    }

    const columns = useMemo(() => [
        {
            Header: "Symbol",
            accessor: "id",
            width: 120,
            disableResizing: true,
            Cell: OneLineCell,
            Filter: ColumnFilter,
        },
        {
            Header: "Name",
            accessor: "name",
            width: 250,
            minWidth: 150,
            Cell: OneLineCell,
            Filter: ColumnFilter,
        },
        {
            Header: "Price",
            accessor: "currentPrice",
            width: 250,
            minWidth: 150,
            Cell: PriceCell,
        },
        {
            Header: "Change",
            accessor: "changePercent",
            width: 250,
            minWidth: 150,
            Cell: ChangeCell,
        },
        {
            Header: "Volume",
            accessor: "volume",
            width: 250,
            minWidth: 150,
            Cell: PriceCell,
        },
        {
            Header: "Type",
            accessor: "type",
            width: 250,
            minWidth: 150,
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
                <Table1
                    columns={columns}
                    // dataValue={assets}
                    fetchData={fetchData}
                />
            </div>
        </div>
    )
}

export default Assets
