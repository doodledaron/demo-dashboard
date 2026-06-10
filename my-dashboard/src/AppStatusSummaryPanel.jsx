import Panel from './Panel'

const groupByApp = (servers) =>
  servers.reduce((groups, server) => {
    if (!groups[server.app]) {
      groups[server.app] = []
    }

    groups[server.app].push(server)
    return groups
  }, {})

const upPercentage = (servers) => {
  const upCount = servers.filter((server) => server.status === 'up').length

  return Math.round((upCount / servers.length) * 100)
}

function AppStatusSummaryPanel({ servers, onAppSelect }) {
  const groups = Object.entries(groupByApp(servers))

  return (
    <Panel title="App Status">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {groups.map(([app, appServers]) => {
          const appUpPercentage = upPercentage(appServers)
          const isHealthy = appUpPercentage === 100

          return (
            <button
              key={app}
              type="button"
              onClick={() => onAppSelect(app)}
              className="rounded-md border border-gray-800 bg-[#030712]/70 p-4 text-left transition hover:border-[#3b82f6]/60 hover:bg-gray-900"
              title={`Open Application Health for ${app}`}
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-[#f9fafb]">
                  {app}
                </h4>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isHealthy ? 'bg-[#22c55e]' : 'bg-[#ef4444]'
                  }`}
                  aria-hidden="true"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                    Servers
                  </p>
                  <p className="mt-2 text-3xl font-bold text-[#f9fafb]">
                    {appServers.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                    Up %
                  </p>
                  <p
                    className={`mt-2 text-3xl font-bold ${
                      isHealthy ? 'text-[#22c55e]' : 'text-[#f59e0b]'
                    }`}
                  >
                    {appUpPercentage}%
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </Panel>
  )
}

export default AppStatusSummaryPanel
