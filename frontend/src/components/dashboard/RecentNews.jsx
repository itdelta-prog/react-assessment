const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString()
}

const CategoryBadge = ({ category }) => {
    const paletteMap = {
        market: 'bg-blue-50 text-blue-600',
        crypto: 'bg-violet-50 text-violet-600',
        stocks: 'bg-emerald-50 text-emerald-600',
    }

    const fallbackStyle = 'bg-slate-100 text-slate-600'

    return (
        <span
            className={`text-[11px] px-2.5 py-1 rounded-lg font-medium capitalize ${
                paletteMap[category] || fallbackStyle
            }`}
        >
            {category}
        </span>
    )
}

const RecentNews = ({ news }) => {
    const { recentNews = [] } = news || {}

    return (
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-5">
                📰 Recent News
            </h2>

            <div className="space-y-5">
                {recentNews.slice(0, 5).map((entry) => (
                    <div
                        key={entry.id}
                        className="border-b border-gray-100 last:border-b-0 pb-5"
                    >
                        <div className="flex items-start justify-between gap-5">
                            <div className="space-y-1">
                                <p className="text-xs text-gray-500">
                                    {entry.source} · {formatTime(entry.timestamp)}
                                </p>
                                <p className="text-sm text-gray-900">
                                    {entry.title}
                                </p>
                            </div>

                            <CategoryBadge category={entry.category} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RecentNews
