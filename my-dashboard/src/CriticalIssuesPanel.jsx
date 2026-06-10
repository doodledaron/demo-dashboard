import Panel from './Panel'

const severityRank = {
  critical: 0,
  warning: 1,
}

const severityClasses = {
  critical: 'border-[#ef4444]/40 bg-[#ef4444]/10 text-[#ef4444]',
  warning: 'border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#f59e0b]',
}

const relativeTime = (timestamp) => {
  const elapsedMs = Date.now() - new Date(timestamp).getTime()
  const elapsedMinutes = Math.max(1, Math.round(elapsedMs / 60000))

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes}m ago`
  }

  return `${Math.round(elapsedMinutes / 60)}h ago`
}

function CriticalIssuesPanel({ alerts }) {
  const sortedAlerts = [...alerts].sort((firstAlert, secondAlert) => {
    const severityDifference =
      severityRank[firstAlert.severity] - severityRank[secondAlert.severity]

    if (severityDifference !== 0) {
      return severityDifference
    }

    return new Date(secondAlert.timestamp) - new Date(firstAlert.timestamp)
  })

  return (
    <Panel title="Critical Issues" className="h-[360px]">
      <div className="max-h-[292px] overflow-y-auto pr-1">
        {sortedAlerts.map((alert) => (
          <article
            key={alert.id}
            className="border-b border-gray-800 py-3 first:pt-0 last:border-b-0 last:pb-0"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${severityClasses[alert.severity]}`}
              >
                {alert.severity}
              </span>
              <span className="text-xs text-[#6b7280]">
                {relativeTime(alert.timestamp)}
              </span>
            </div>
            <p className="text-sm font-medium leading-5 text-[#f9fafb]">
              {alert.message}
            </p>
            <p className="mt-1 text-xs text-[#6b7280]">{alert.server}</p>
          </article>
        ))}
      </div>
    </Panel>
  )
}

export default CriticalIssuesPanel
