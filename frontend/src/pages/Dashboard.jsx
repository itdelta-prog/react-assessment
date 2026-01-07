// Dashboard Page - TO BE IMPLEMENTED BY CANDIDATE
// This is a basic placeholder structure

import {useEffect, useState} from "react";
import {getPortfolio, getDashboard} from '../services/api'
import PortfolioSummaryCard from "../components/dashboard/PortfolioSummaryCard";
import Tops from "../components/dashboard/Tops";
import RecentNews from "../components/dashboard/RecentNews";
import ActiveAlerts from "../components/dashboard/ActiveAlerts";

const Dashboard = () => {
    const [portfolio, setPortfolio] = useState(null)
    const [dashboard, setDashboard] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            let res = await getPortfolio();
            if (!res?.data?.success) throw new Error('API error')
            const portfolioData = res.data.data;

            res = await getDashboard();
            if (!res?.data?.success) throw new Error('API error')
            const dashboardData = res.data.data;

            // pause for the skeleton
            setInterval(() => {
                setPortfolio(portfolioData);
                setDashboard(dashboardData);
            }, 500);
        }
        fetchData()
    }, [])

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <PortfolioSummaryCard portfolio={portfolio}/>
            <Tops tops={dashboard}/>
            <RecentNews news={dashboard}/>
            <ActiveAlerts alerts={dashboard?.activeAlerts}/>
        </div>
    )
}

export default Dashboard
