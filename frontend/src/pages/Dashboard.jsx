// Dashboard Page - TO BE IMPLEMENTED BY CANDIDATE
// This is a basic placeholder structure

import {useEffect, useState} from "react";
import {getPortfolio} from '../services/api'
import PortfolioSummaryCard from "../components/dashboard/PortfolioSummaryCard";

const Dashboard = () => {
    const [portfolio, setPortfolio] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const res = await getPortfolio();
            if (!res?.data?.success) throw new Error('API error')

            // pause for the skeleton
            setInterval(() => setPortfolio(res.data.data), 500)
        }
        fetchData()
    }, [])

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <PortfolioSummaryCard portfolio={portfolio}/>
            </div>
        </div>
    )
}

export default Dashboard
