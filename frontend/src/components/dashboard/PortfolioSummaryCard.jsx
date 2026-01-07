const PortfolioSummaryCard = ({portfolio}) => {
    const {totalValue, totalChange, totalChangePercent} = portfolio ?? {}

    const isPositive = totalChange >= 0

    return (
        <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Portfolio Summary
            </h2>

            <div className="flex items-end justify-between">

                {portfolio ? (<>
                    <div>
                        <p className="text-sm text-gray-500">Total Value</p>
                        <p className="text-xl font-bold">
                            ${totalValue?.toLocaleString()}
                        </p>
                    </div>

                    <div className={`text-right ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        <p className="text-sm font-medium">
                            {isPositive ? '+' : ''}
                            ${totalChange?.toLocaleString()}
                        </p>
                        <p className="text-sm">
                            ({isPositive ? '+' : ''}
                            {totalChangePercent?.toFixed(2)}%)
                        </p>
                    </div>
                </>) : (
                    <>
                        <p className="text-sm text-gray-500">Total Value</p>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </>
                )}
            </div>
        </div>
    )
}

export default PortfolioSummaryCard;
