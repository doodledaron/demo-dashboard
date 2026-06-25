import { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import HoneycombPanel from './HoneycombPanel'
import Panel from './Panel'
import StatCard from './StatCard'

const ENVS = ['PROD', 'DR']

const ENV_STYLES = {
  PROD: {
    badge: 'border-[#3b82f6]/40 bg-[#3b82f6]/10 text-[#3b82f6]',
    divider: 'lg:border-r lg:border-gray-800 lg:pr-5',
  },
  DR: {
    badge: 'border-[#14b8a6]/40 bg-[#14b8a6]/10 text-[#14b8a6]',
    divider: 'lg:pl-5',
  },
}

const CHART_COLORS = {
  blue: '#3b82f6',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  purple: '#a855f7',
  teal: '#14b8a6',
  pink: '#ec4899',
  grid: '#1f2937',
  muted: '#6b7280',
  tooltipBg: '#111827',
  tooltipBorder: '#374151',
}

const average = (values) =>
  values.reduce((total, value) => total + value, 0) / values.length

const formatPercent = (value) => `${value.toFixed(1)}%`

const availabilityStatus = (value) => {
  if (value >= 99) {
    return 'green'
  }

  if (value >= 95) {
    return 'amber'
  }

  return 'red'
}

const usageColorClass = (value) => {
  if (value > 85) {
    return 'bg-[#ef4444]'
  }

  if (value >= 70) {
    return 'bg-[#f59e0b]'
  }

  return 'bg-[#22c55e]'
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-md border border-[#374151] bg-[#111827] px-3 py-2 shadow-xl">
      <p className="text-xs text-[#6b7280]">{label}</p>
      <div className="mt-2 space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-5">
            <span className="text-xs" style={{ color: entry.color }}>
              {entry.name}
            </span>
            <span className="text-xs font-semibold text-[#f9fafb]">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChartShell({ title, children }) {
  return (
    <Panel title={title}>
      <ResponsiveContainer width="100%" height={160}>
        {children}
      </ResponsiveContainer>
    </Panel>
  )
}

function ChartLegend({ payload }) {
  return (
    <Legend
      iconSize={8}
      payload={payload}
      wrapperStyle={{
        color: CHART_COLORS.muted,
        fontSize: 11,
        paddingTop: 6,
      }}
    />
  )
}

function TrafficChart({ data }) {
  return (
    <ChartShell title="Requests/sec">
      <LineChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="time"
          tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: CHART_COLORS.grid }}
          minTickGap={14}
        />
        <YAxis
          tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: CHART_COLORS.grid }}
          label={{
            value: 'req/sec',
            angle: -90,
            position: 'insideLeft',
            fill: CHART_COLORS.muted,
            fontSize: 11,
          }}
        />
        <Tooltip content={<ChartTooltip />} />
        <Line
          type="monotone"
          dataKey="requestsPerSec"
          name="requests/sec"
          stroke={CHART_COLORS.blue}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartShell>
  )
}

function ErrorsChart({ data }) {
  return (
    <ChartShell title="Error Rate">
      <LineChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="time"
          tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: CHART_COLORS.grid }}
          minTickGap={14}
        />
        <YAxis
          tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: CHART_COLORS.grid }}
          label={{
            value: '5xx %',
            angle: -90,
            position: 'insideLeft',
            fill: CHART_COLORS.muted,
            fontSize: 11,
          }}
        />
        <Tooltip content={<ChartTooltip />} />
        <Line
          type="monotone"
          dataKey="errorRate"
          name="error rate"
          stroke={CHART_COLORS.red}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartShell>
  )
}

function LatencyChart({ data }) {
  return (
    <ChartShell title="Latency">
      <LineChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="time"
          tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: CHART_COLORS.grid }}
          minTickGap={14}
        />
        <YAxis
          tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: CHART_COLORS.grid }}
          label={{
            value: 'ms',
            angle: -90,
            position: 'insideLeft',
            fill: CHART_COLORS.muted,
            fontSize: 11,
          }}
        />
        <Tooltip content={<ChartTooltip />} />
        <ChartLegend />
        <Line
          type="monotone"
          dataKey="p50"
          name="p50"
          stroke={CHART_COLORS.green}
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="p95"
          name="p95"
          stroke={CHART_COLORS.amber}
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="p99"
          name="p99"
          stroke={CHART_COLORS.red}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartShell>
  )
}

function SaturationMetric({ label, value }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-[11px] uppercase tracking-wide text-[#6b7280]">
          {label}
        </span>
        <span className="text-xs font-semibold text-gray-300">{value.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-800">
        <div
          className={`h-full rounded-full ${usageColorClass(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function SaturationList({ data, onServerSelect }) {
  const sortedData = [...data].sort(
    (firstItem, secondItem) => secondItem.maxSaturation - firstItem.maxSaturation,
  )

  return (
    <Panel title="Saturation">
      <div className="max-h-[344px] space-y-3 overflow-y-auto pr-1">
        {sortedData.map((item) => (
          <button
            key={item.serverId}
            type="button"
            onClick={() => onServerSelect(item.serverId)}
            className="w-full rounded-md border border-gray-800 bg-[#030712]/70 p-3 text-left transition hover:border-[#3b82f6]/60 hover:bg-gray-900"
            title={`Open Server Health for ${item.hostname}`}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#f9fafb]">{item.hostname}</p>
                <p className="text-xs text-[#6b7280]">{item.app}</p>
              </div>
              <span className="text-xs font-semibold text-gray-300">
                peak {item.maxSaturation.toFixed(1)}%
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <SaturationMetric label="CPU" value={item.cpu} />
              <SaturationMetric label="Memory" value={item.memory} />
              <SaturationMetric label="Disk I/O" value={item.diskIo} />
              <SaturationMetric label="Network" value={item.networkBandwidth} />
            </div>
          </button>
        ))}
      </div>
    </Panel>
  )
}

function GoldenSignalsGrid({ signal, saturation, onServerSelect }) {
  return (
    <div className="grid gap-4 2xl:grid-cols-2">
      <TrafficChart data={signal.traffic} />
      <ErrorsChart data={signal.errors} />
      <LatencyChart data={signal.latency} />
      <SaturationList data={saturation} onServerSelect={onServerSelect} />
    </div>
  )
}

function EnvHeader({ env }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-[#6b7280]">Environment</p>
        <h3 className="mt-1 text-lg font-semibold text-[#f9fafb]">{env}</h3>
      </div>
      <span
        className={`rounded-full border px-3 py-1 text-xs font-semibold ${ENV_STYLES[env].badge}`}
      >
        {env}
      </span>
    </div>
  )
}

function EnvColumn({
  alerts,
  applicationSignals,
  env,
  goldenSignals,
  servers,
  onServerSelect,
}) {
  const envServers = servers.filter((server) => server.env === env)
  const envAlerts = alerts.filter((alert) => alert.env === env)
  const envSignal = goldenSignals.find((signal) => signal.env === env)
  const envSaturation = applicationSignals
    .filter((signal) => signal.env === env)
    .map((signal) => ({
      serverId: signal.serverId,
      hostname: signal.hostname,
      app: signal.app,
      ...signal.saturation,
      maxSaturation: Math.max(
        signal.saturation.cpu,
        signal.saturation.memory,
        signal.saturation.diskIo,
        signal.saturation.networkBandwidth,
      ),
    }))
  const availability = average(envServers.map((server) => server.availability30d))
  const healthyServers = envServers.filter((server) => server.status === 'up').length
  const criticalAlerts = envAlerts.filter(
    (alert) => alert.severity === 'critical',
  ).length

  const stats = [
    {
      label: 'Availability %',
      value: formatPercent(availability),
      statusColor: availabilityStatus(availability),
    },
    {
      label: 'Servers Healthy',
      value: `${healthyServers}/${envServers.length}`,
      statusColor: healthyServers === envServers.length ? 'green' : 'red',
    },
    {
      label: 'Critical Alerts',
      value: criticalAlerts.toString(),
      statusColor: criticalAlerts > 0 ? 'red' : 'green',
    },
  ]

  return (
    <section className={`min-w-0 space-y-6 ${ENV_STYLES[env].divider}`}>
      <EnvHeader env={env} />

      <div className="grid gap-3 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={`${env}-${stat.label}`}
            label={stat.label}
            value={stat.value}
            statusColor={stat.statusColor}
          />
        ))}
      </div>

      <HoneycombPanel servers={envServers} onServerSelect={onServerSelect} />
      <GoldenSignalsGrid
        signal={envSignal}
        saturation={envSaturation}
        onServerSelect={onServerSelect}
      />
    </section>
  )
}

function UsageBar({ value }) {
  return (
    <div className="flex min-w-[110px] items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-800">
        <div
          className={`h-full rounded-full ${usageColorClass(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-11 text-right text-xs text-gray-300">{value.toFixed(1)}%</span>
    </div>
  )
}

function EnvBadge({ env }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${ENV_STYLES[env].badge}`}
    >
      {env}
    </span>
  )
}

function ServerResourceOverview({ servers, onServerSelect }) {
  const sortedServers = [...servers].sort((firstServer, secondServer) => {
    const envDifference =
      ENVS.indexOf(firstServer.env) - ENVS.indexOf(secondServer.env)

    if (envDifference !== 0) {
      return envDifference
    }

    return firstServer.hostname.localeCompare(secondServer.hostname)
  })

  return (
    <Panel title="Server Resource Overview">
      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-[1280px] w-full border-separate border-spacing-0 text-left text-sm">
          <thead className="sticky top-0 z-10 bg-gray-900 text-[11px] uppercase tracking-wide text-[#6b7280]">
            <tr>
              <th className="border-b border-gray-800 px-3 py-3 font-semibold">env</th>
              <th className="border-b border-gray-800 px-3 py-3 font-semibold">
                hostname
              </th>
              <th className="border-b border-gray-800 px-3 py-3 font-semibold">
                instance
              </th>
              <th className="border-b border-gray-800 px-3 py-3 font-semibold">os</th>
              <th className="border-b border-gray-800 px-3 py-3 font-semibold">
                cpu cores
              </th>
              <th className="border-b border-gray-800 px-3 py-3 font-semibold">
                cpu usage
              </th>
              <th className="border-b border-gray-800 px-3 py-3 font-semibold">
                total memory
              </th>
              <th className="border-b border-gray-800 px-3 py-3 font-semibold">
                memory usage
              </th>
              <th className="border-b border-gray-800 px-3 py-3 font-semibold">
                disk space
              </th>
              <th className="border-b border-gray-800 px-3 py-3 font-semibold">
                disk usage
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedServers.map((server, index) => (
              <tr
                key={server.id}
                onClick={() => onServerSelect(server.id)}
                className={`cursor-pointer transition hover:bg-gray-800 ${
                  index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-950'
                }`}
              >
                <td className="border-b border-gray-800 px-3 py-3">
                  <EnvBadge env={server.env} />
                </td>
                <td className="border-b border-gray-800 px-3 py-3 text-[#f9fafb]">
                  {server.hostname}
                </td>
                <td className="border-b border-gray-800 px-3 py-3 text-gray-300">
                  {server.instance}
                </td>
                <td className="border-b border-gray-800 px-3 py-3 text-gray-300">
                  {server.os}
                </td>
                <td className="border-b border-gray-800 px-3 py-3 text-gray-300">
                  {server.cpuCores}
                </td>
                <td className="border-b border-gray-800 px-3 py-3">
                  <UsageBar value={server.cpuUsage} />
                </td>
                <td className="border-b border-gray-800 px-3 py-3 text-gray-300">
                  {server.totalMemory}
                </td>
                <td className="border-b border-gray-800 px-3 py-3">
                  <UsageBar value={server.memoryUsage} />
                </td>
                <td className="border-b border-gray-800 px-3 py-3 text-gray-300">
                  {server.diskSpace}
                </td>
                <td className="border-b border-gray-800 px-3 py-3">
                  <UsageBar value={server.diskUsage} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

function AppHealthDashboard({ onServerSelect }) {
  const [dashboardData, setDashboardData] = useState({
    alerts: null,
    applicationSignals: null,
    goldenSignals: null,
    servers: null,
  })

  useEffect(() => {
    let ignore = false

    async function fetchDashboardData() {
      const [
        alertsResponse,
        applicationSignalsResponse,
        goldenSignalsResponse,
        serversResponse,
      ] = await Promise.all([
        fetch('/api/alerts'),
        fetch('/api/application-signals'),
        fetch('/api/golden-signals'),
        fetch('/api/servers'),
      ])

      if (ignore) {
        return
      }

      setDashboardData({
        alerts: await alertsResponse.json(),
        applicationSignals: await applicationSignalsResponse.json(),
        goldenSignals: await goldenSignalsResponse.json(),
        servers: await serversResponse.json(),
      })
    }

    fetchDashboardData()

    return () => {
      ignore = true
    }
  }, [])

  const { alerts, applicationSignals, goldenSignals, servers } = dashboardData
  const isLoading = !alerts || !applicationSignals || !goldenSignals || !servers

  if (isLoading) {
    return (
      <Panel className="min-h-64 bg-gray-900/30">
        <p className="text-sm text-[#6b7280]">Loading application health data...</p>
      </Panel>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-sm font-medium uppercase tracking-wide text-[#6b7280]">
        Application Health
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        {ENVS.map((env) => (
          <EnvColumn
            key={env}
            alerts={alerts}
            applicationSignals={applicationSignals}
            env={env}
            goldenSignals={goldenSignals}
            servers={servers}
            onServerSelect={onServerSelect}
          />
        ))}
      </div>

      <section className="border-t border-gray-800 pt-6">
        <ServerResourceOverview servers={servers} onServerSelect={onServerSelect} />
      </section>
    </div>
  )
}

export default AppHealthDashboard
