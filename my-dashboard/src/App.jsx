import { useState } from 'react'
import AppHealthDashboard from './AppHealthDashboard'
import AppStatusSummaryPanel from './AppStatusSummaryPanel'
import AvailabilityTrendPanel from './AvailabilityTrendPanel'
import CriticalIssuesPanel from './CriticalIssuesPanel'
import Panel from './Panel'
import ServerHealthDashboard from './ServerHealthDashboard'
import StatCard from './StatCard'
import { alerts, availabilityTimeSeries, servers } from './mockData'

const dashboards = [
  {
    id: 'l1-support',
    name: 'L1 Support Dashboard',
    description: 'Live support queue and infrastructure incident overview.',
  },
  {
    id: 'application-health',
    name: 'Application Health Dashboard',
    description: 'Blank workspace for application uptime, latency, and error views.',
  },
  {
    id: 'server-health',
    name: 'Server Health Dashboard',
    description: 'Blank workspace for infrastructure, CPU, memory, and disk views.',
  },
]

const SLA_THRESHOLD = 95

const average = (values) =>
  values.reduce((total, value) => total + value, 0) / values.length

const formatPercent = (value) => `${value.toFixed(1)}%`

function L1SupportDashboard({ onAppSelect }) {
  const uptimeAverage = average(servers.map((server) => server.uptime))
  const availabilityAverage = average(
    availabilityTimeSeries.map((entry) => entry.availability),
  )
  const hasCriticalAlerts = alerts.some((alert) => alert.severity === 'critical')
  const uptimeHealthy = uptimeAverage > SLA_THRESHOLD
  const availabilityHealthy = availabilityAverage >= SLA_THRESHOLD

  const stats = [
    {
      label: 'Servers Uptime %',
      value: formatPercent(uptimeAverage),
      statusColor: uptimeHealthy ? 'green' : 'red',
    },
    {
      label: 'Active Alerts',
      value: alerts.length.toString(),
      statusColor: hasCriticalAlerts ? 'red' : 'green',
    },
    {
      label: 'Availability (30d)',
      value: formatPercent(availabilityAverage),
      statusColor: availabilityHealthy ? 'green' : 'amber',
    },
  ]

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            statusColor={stat.statusColor}
          />
        ))}
      </section>

      <section className="border-t border-gray-800 pt-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)]">
          <AvailabilityTrendPanel data={availabilityTimeSeries} />
          <CriticalIssuesPanel alerts={alerts} />
        </div>
      </section>

      <section className="border-t border-gray-800 pt-6">
        <AppStatusSummaryPanel servers={servers} onAppSelect={onAppSelect} />
      </section>
    </div>
  )
}

function PlaceholderDashboard({ dashboard }) {
  return (
    <Panel className="min-h-[calc(100vh-11rem)] border-dashed bg-gray-900/30">
      <p className="text-sm text-[#6b7280]">{dashboard.description}</p>
    </Panel>
  )
}

function App() {
  const [activeDashboardId, setActiveDashboardId] = useState(dashboards[0].id)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedServerId, setSelectedServerId] = useState('server-01')
  const activeDashboard = dashboards.find(
    (dashboard) => dashboard.id === activeDashboardId,
  )

  const handleServerSelect = (serverId) => {
    setSelectedServerId(serverId)
    setActiveDashboardId('server-health')
  }

  const handleAppSelect = () => {
    setActiveDashboardId('application-health')
  }

  return (
    <main className="min-h-screen bg-[#030712] text-[#f9fafb]">
      <div className="flex min-h-screen">
        <aside
          className={`hidden shrink-0 border-r border-gray-800 bg-[#030712] p-4 transition-[width] duration-200 lg:block ${
            isSidebarCollapsed ? 'w-[76px]' : 'w-72'
          }`}
        >
          <div className="mb-8 flex items-start justify-between gap-3">
            {!isSidebarCollapsed ? (
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-[#3b82f6]">
                  ACSM Operation
                </p>
                <h1 className="mt-3 text-2xl font-semibold leading-tight text-[#f9fafb]">
                  Dashboard Demo
                </h1>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((value) => !value)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-gray-800 bg-gray-900 text-sm font-semibold text-gray-300 transition hover:border-[#3b82f6]/60 hover:text-[#f9fafb]"
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? '>' : '<'}
            </button>
          </div>

          <nav className="space-y-2" aria-label="Dashboards">
            {dashboards.map((dashboard) => {
              const isActive = dashboard.id === activeDashboardId
              const shortName = dashboard.name
                .split(' ')
                .map((word) => word[0])
                .join('')

              return (
                <button
                  key={dashboard.id}
                  type="button"
                  onClick={() => setActiveDashboardId(dashboard.id)}
                  title={dashboard.name}
                  className={`w-full rounded-md border py-3 text-sm transition ${
                    isActive
                      ? 'border-[#3b82f6]/60 bg-[#3b82f6]/10 text-[#f9fafb]'
                      : 'border-transparent text-[#6b7280] hover:border-gray-800 hover:bg-gray-900 hover:text-[#f9fafb]'
                  } ${isSidebarCollapsed ? 'px-2 text-center' : 'px-4 text-left'}`}
                >
                  {isSidebarCollapsed ? shortName : dashboard.name}
                </button>
              )
            })}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-gray-800 bg-[#030712]/90 px-5 py-4 backdrop-blur sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed((value) => !value)}
                  className="hidden h-9 w-9 shrink-0 place-items-center rounded-md border border-gray-800 bg-gray-900 text-sm font-semibold text-gray-300 transition hover:border-[#3b82f6]/60 hover:text-[#f9fafb] lg:grid"
                  aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {isSidebarCollapsed ? '>' : '<'}
                </button>

                <div>
                  <p className="text-sm text-[#6b7280]">Current view</p>
                  <h2 className="mt-1 text-xl font-semibold text-[#f9fafb] sm:text-2xl">
                    {activeDashboard.name}
                  </h2>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto lg:hidden">
                {dashboards.map((dashboard) => {
                  const isActive = dashboard.id === activeDashboardId

                  return (
                    <button
                      key={dashboard.id}
                      type="button"
                      onClick={() => setActiveDashboardId(dashboard.id)}
                      className={`shrink-0 rounded-md border px-3 py-2 text-sm ${
                        isActive
                          ? 'border-[#3b82f6]/60 bg-[#3b82f6]/10 text-[#f9fafb]'
                          : 'border-gray-800 text-[#6b7280]'
                      }`}
                    >
                      {dashboard.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </header>

          <div className="flex-1 p-5 sm:p-8">
            {activeDashboardId === 'l1-support' ? (
              <L1SupportDashboard onAppSelect={handleAppSelect} />
            ) : activeDashboardId === 'application-health' ? (
              <AppHealthDashboard onServerSelect={handleServerSelect} />
            ) : activeDashboardId === 'server-health' ? (
              <ServerHealthDashboard serverId={selectedServerId} />
            ) : (
              <PlaceholderDashboard dashboard={activeDashboard} />
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
