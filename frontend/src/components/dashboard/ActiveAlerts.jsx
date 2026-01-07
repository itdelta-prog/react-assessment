const levelThemeMap = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-amber-50 text-amber-600',
    high: 'bg-orange-50 text-orange-600',
    critical: 'bg-rose-50 text-rose-600',
}

const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleString()

const ActiveAlerts = ({ alerts = []}) => {
    return (
        <div className="bg-white rounded-2xl shadow p-5 mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-5">
                🚨 Active Alerts
            </h2>

            <div className="space-y-5">
                {alerts.slice(0, 5).map((entry) => (
                    <div
                        key={entry.id}
                        className="flex items-start justify-between gap-5 border-b border-gray-100 last:border-b-0 pb-5"
                    >
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500">
                                {formatTime(entry.timestamp)}
                            </p>
                            <p className="text-sm text-gray-900">
                                {entry.message}
                            </p>
                        </div>

                        <span
                            className={`text-xs px-2.5 py-1 rounded-lg font-medium capitalize ${
                                levelThemeMap[entry.severity]
                            }`}
                        >
                            {entry.severity}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ActiveAlerts
