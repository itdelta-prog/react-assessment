const DeltaLine = ({ payload }) => {
    const directionFlag = payload.deltaRatio >= 0

    return (
        <div className="flex justify-between items-center py-2.5">
            <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">
                    {payload.symbol}
                </span>
                <span className="text-[11px] text-gray-400">
                    {payload.name}
                </span>
            </div>

            <div className="text-right leading-tight">
                <div className="text-sm font-semibold">
                    ${payload.currentPrice?.toLocaleString()}
                </div>
                <div
                    className={`text-xs font-medium ${
                        directionFlag ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                >
                    {directionFlag && '+'}
                    {payload.changePercent?.toFixed(2)}%
                </div>
            </div>
        </div>
    )
}

const Tops = ({ tops }) => {
    const {
        topGainers = [],
        topLosers = [],
    } = tops || {}

    return (
        <section className="bg-white rounded-2xl shadow p-5 mb-5">
            <header className="mb-5">
                <h2 className="text-base font-semibold text-gray-800">
                    Market Activity
                </h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <article>
                    <h3 className="text-xs font-semibold text-emerald-600 mb-3 uppercase tracking-wide">
                        🚀 Gainers
                    </h3>

                    <div className="divide-y divide-gray-100">
                        {tops ? (
                            topGainers.slice(0, 3).map((entry) => (
                                    <DeltaLine
                                        key={entry.symbol}
                                        payload={entry}
                                    />
                                ))
                        ) : (
                            [0,1,2].map((entry, idx) => (
                                <SkeletonItem key={idx}/>
                            ))
                        )}
                    </div>
                </article>

                <article>
                    <h3 className="text-xs font-semibold text-rose-600 mb-3 uppercase tracking-wide">
                        📉 Losers
                    </h3>

                    <div className="divide-y divide-gray-100">
                        {tops ? (
                            topLosers.slice(0, 3).map((entry) => (
                                <DeltaLine
                                    key={entry.symbol}
                                    payload={entry}
                                />
                            ))
                        ) : (
                            [0,1,2].map((entry, idx) => (
                                <SkeletonItem key={idx}/>
                            ))
                        )}
                    </div>
                </article>
            </div>
        </section>
    )
}

const SkeletonItem = () => {
    return (
        <div className="h-6 bg-gray-200 rounded w-3/4 my-5">&nbsp;</div>
    );
}

export default Tops
