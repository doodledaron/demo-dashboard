import { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ErrorStatPanel from './ErrorStatPanel'
import Panel from './Panel'
import StatCard from './StatCard'

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
}

const sum = (values) => values.reduce((total, value) => total + value, 0)

const last = (values) => values[values.length - 1]

const formatPercent = (value) => `${value.toFixed(1)}%`

const usageStatus = (value) => {
  if (value > 85) {
    return 'red'
  }

  if (value >= 70) {
    return 'amber'
  }

  return 'green'
}

const healthStatus = (score) => {
  if (score >= 90) {
    return 'green'
  }

  if (score >= 70) {
    return 'amber'
  }

  return 'red'
}

const uptimeStatus = (value) => {
  if (value >= 99) {
    return 'green'
  }

  if (value >= 95) {
    return 'amber'
  }

  return 'red'
}

const statusColor = {
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
}

function seriesData(metrics, key, values) {
  return metrics.timePoints.map((time, index) => ({
    time,
    [key]: values[index],
  }))
}

function multiSeriesData(metrics, seriesMap) {
  return metrics.timePoints.map((time, index) => {
    const point = { time }

    seriesMap.forEach((series) => {
      point[series.key] = series.values[index]
    })

    return point
  })
}

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-md border border-[#374151] bg-[#111827] px-3 py-2 shadow-xl">
      <p className="text-xs text-[#9ca3af]">{label}</p>
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

function ChartLegend() {
  return (
    <Legend
      iconSize={8}
      wrapperStyle={{
        color: CHART_COLORS.muted,
        fontSize: 11,
        paddingTop: 6,
      }}
    />
  )
}

function SingleLinePanel({ title, data, dataKey, name, color, yDomain, yLabel, threshold }) {
  return (
    <Panel title={title}>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: CHART_COLORS.grid }}
            minTickGap={12}
          />
          <YAxis
            domain={yDomain}
            tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: CHART_COLORS.grid }}
            label={{
              value: yLabel,
              angle: -90,
              position: 'insideLeft',
              fill: CHART_COLORS.muted,
              fontSize: 10,
            }}
          />
          <Tooltip content={<DarkTooltip />} />
          {threshold ? (
            <ReferenceLine
              y={threshold}
              stroke={CHART_COLORS.red}
              strokeDasharray="4 4"
              label={{
                value: 'threshold',
                position: 'insideTopRight',
                fill: CHART_COLORS.red,
                fontSize: 10,
              }}
            />
          ) : null}
          <Line
            type="monotone"
            dataKey={dataKey}
            name={name}
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Panel>
  )
}

function DualAxisPanel({ title, data, left, right }) {
  return (
    <Panel title={title}>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: CHART_COLORS.grid }}
            minTickGap={12}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: CHART_COLORS.grid }}
            label={{
              value: left.label,
              angle: -90,
              position: 'insideLeft',
              fill: CHART_COLORS.muted,
              fontSize: 10,
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: CHART_COLORS.grid }}
            label={{
              value: right.label,
              angle: 90,
              position: 'insideRight',
              fill: CHART_COLORS.muted,
              fontSize: 10,
            }}
          />
          <Tooltip content={<DarkTooltip />} />
          <ChartLegend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey={left.dataKey}
            name={left.name}
            stroke={left.color}
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={right.dataKey}
            name={right.name}
            stroke={right.color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Panel>
  )
}

function MultiLinePanel({ title, data, lines, yLabel }) {
  return (
    <Panel title={title}>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: CHART_COLORS.grid }}
            minTickGap={12}
          />
          <YAxis
            tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: CHART_COLORS.grid }}
            label={{
              value: yLabel,
              angle: -90,
              position: 'insideLeft',
              fill: CHART_COLORS.muted,
              fontSize: 10,
            }}
          />
          <Tooltip content={<DarkTooltip />} />
          <ChartLegend />
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Panel>
  )
}

function HealthGauge({ score }) {
  const status = healthStatus(score)
  const arcLength = 188.5

  return (
    <Panel>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
        Overall Health Score
      </p>
      <div className="mt-3 flex justify-center">
        <svg viewBox="0 0 160 96" className="h-28 w-full max-w-[220px]">
          <path
            d="M 24 80 A 56 56 0 0 1 136 80"
            fill="none"
            stroke="#1f2937"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 24 80 A 56 56 0 0 1 136 80"
            fill="none"
            stroke={statusColor[status]}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * arcLength} ${arcLength}`}
          />
          <text
            x="80"
            y="70"
            textAnchor="middle"
            fill={statusColor[status]}
            fontSize="28"
            fontWeight="700"
          >
            {score}
          </text>
        </svg>
      </div>
    </Panel>
  )
}

function ProcessCountPanel({ metrics }) {
  const currentProcessCount = last(metrics.processes.count)

  return (
    <Panel title="Number of Processes">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
            Current Processes
          </p>
          <p className="mt-1 text-3xl font-bold text-[#f9fafb]">
            {currentProcessCount}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <LineChart
          data={seriesData(metrics, 'processCount', metrics.processes.count)}
          margin={{ top: 6, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: CHART_COLORS.grid }}
            minTickGap={12}
          />
          <YAxis
            tick={{ fill: CHART_COLORS.muted, fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: CHART_COLORS.grid }}
            label={{
              value: 'count',
              angle: -90,
              position: 'insideLeft',
              fill: CHART_COLORS.muted,
              fontSize: 10,
            }}
          />
          <Tooltip content={<DarkTooltip />} />
          <Line
            type="monotone"
            dataKey="processCount"
            name="process count"
            stroke={CHART_COLORS.blue}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Panel>
  )
}

function TopProcessMetric({ label, value, maxValue, suffix }) {
  const width = maxValue > 0 ? (value / maxValue) * 100 : 0

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-[11px] uppercase tracking-wide text-[#6b7280]">
          {label}
        </span>
        <span className="text-xs font-semibold text-gray-300">
          {value}
          {suffix}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-800">
        <div className="h-full rounded-full bg-[#3b82f6]" style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

function TopProcessesPanel({ processes }) {
  const maxCpu = Math.max(...processes.map((process) => process.cpuPercent))
  const maxMemory = Math.max(...processes.map((process) => process.memoryMB))
  const maxDisk = Math.max(...processes.map((process) => process.diskMBs))
  const maxNetwork = Math.max(...processes.map((process) => process.networkMBs))
  const sortedProcesses = [...processes]
    .map((process) => ({
      ...process,
      resourceScore:
        process.cpuPercent / maxCpu +
        process.memoryMB / maxMemory +
        process.diskMBs / maxDisk +
        process.networkMBs / maxNetwork,
    }))
    .sort((firstProcess, secondProcess) => secondProcess.resourceScore - firstProcess.resourceScore)

  return (
    <Panel title="Top Processes">
      <div className="max-h-[254px] space-y-3 overflow-y-auto pr-1">
        {sortedProcesses.map((process, index) => (
          <article
            key={process.pid}
            className="rounded-md border border-gray-800 bg-[#030712]/70 p-3"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#f9fafb]">
                  {index + 1}. {process.name}
                </p>
                <p className="text-xs text-[#6b7280]">PID {process.pid}</p>
              </div>
              <span className="text-xs font-semibold text-gray-300">
                score {process.resourceScore.toFixed(2)}
              </span>
            </div>
            <div className="grid gap-2 md:grid-cols-4">
              <TopProcessMetric
                label="CPU"
                value={process.cpuPercent}
                maxValue={maxCpu}
                suffix="%"
              />
              <TopProcessMetric
                label="RAM"
                value={process.memoryMB}
                maxValue={maxMemory}
                suffix=" MB"
              />
              <TopProcessMetric
                label="Disk"
                value={process.diskMBs}
                maxValue={maxDisk}
                suffix=" MB/s"
              />
              <TopProcessMetric
                label="Network"
                value={process.networkMBs}
                maxValue={maxNetwork}
                suffix=" MB/s"
              />
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}

function OOMDot(props) {
  const { cx, cy, index, payload } = props
  const oomEventIndices = payload.oomEventIndices ?? []

  if (!oomEventIndices.includes(index)) {
    return null
  }

  return <circle cx={cx} cy={cy} r={5} fill="#ef4444" stroke="#fff" strokeWidth={1.5} />
}

function ServerHealthDashboard({ serverId }) {
  const [servers, setServers] = useState(null)
  const [selectedMetrics, setSelectedMetrics] = useState(null)

  useEffect(() => {
    let ignore = false

    async function fetchServers() {
      const response = await fetch('/api/servers')
      const nextServers = await response.json()

      if (!ignore) {
        setServers(nextServers)
      }
    }

    fetchServers()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function fetchSelectedMetrics() {
      const response = await fetch(`/api/server-metrics/${serverId}`)

      if (response.ok) {
        const metrics = await response.json()

        if (!ignore) {
          setSelectedMetrics(metrics)
        }

        return
      }

      if (response.status === 404) {
        const allMetricsResponse = await fetch('/api/server-metrics')
        const allMetrics = await allMetricsResponse.json()

        if (!ignore) {
          setSelectedMetrics(allMetrics[0] ?? null)
        }
      }
    }

    fetchSelectedMetrics()

    return () => {
      ignore = true
    }
  }, [serverId])

  if (!servers || !selectedMetrics) {
    return (
      <Panel className="min-h-64 bg-gray-900/30">
        <p className="text-sm text-[#6b7280]">Loading server health data...</p>
      </Panel>
    )
  }

  const currentCpu = last(selectedMetrics.cpu.usage)
  const currentMemory = last(selectedMetrics.memory.usage)
  const currentDisk = last(selectedMetrics.disk.usage)
  const currentPacketLoss = last(selectedMetrics.network.packetLossPercent)
  const selectedServer = servers.find((server) => server.id === selectedMetrics.serverId)
  const uptime = selectedServer?.uptime ?? 0
  const healthScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        100 -
          (currentCpu * 0.35 +
            currentMemory * 0.3 +
            currentDisk * 0.2 +
            currentPacketLoss * 15 * 0.15),
      ),
    ),
  )
  const throttleEvents = sum(selectedMetrics.cpu.throttleEvents)
  const diskErrors =
    sum(selectedMetrics.disk.readErrors) + sum(selectedMetrics.disk.writeErrors)
  const packetErrors = sum(selectedMetrics.network.packetErrors)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-[#6b7280]">
          Server Health
        </p>
        <h3 className="mt-1 text-xl font-semibold text-[#f9fafb]">
          {selectedMetrics.serverId}
        </h3>
      </div>

      <section className="grid gap-4 xl:grid-cols-5">
        <HealthGauge score={healthScore} />
        <StatCard
          label="Server Uptime %"
          value={formatPercent(uptime)}
          statusColor={uptimeStatus(uptime)}
        />
        <StatCard
          label="CPU Utilization %"
          value={formatPercent(currentCpu)}
          statusColor={usageStatus(currentCpu)}
        />
        <StatCard
          label="Memory Utilization %"
          value={formatPercent(currentMemory)}
          statusColor={usageStatus(currentMemory)}
        />
        <StatCard
          label="Disk Space Utilization %"
          value={formatPercent(currentDisk)}
          statusColor={usageStatus(currentDisk)}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <ProcessCountPanel metrics={selectedMetrics} />
        <TopProcessesPanel processes={selectedMetrics.processes.topProcesses} />
      </section>

      <section className="grid gap-3 xl:grid-cols-3">
        {['Utilization', 'Saturation', 'Errors'].map((header) => (
          <div
            key={header}
            className="sticky top-0 z-10 bg-[#030712] py-2 text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]"
          >
            {header}
          </div>
        ))}

        <SingleLinePanel
          title="CPU %"
          data={seriesData(selectedMetrics, 'cpuUsage', selectedMetrics.cpu.usage)}
          dataKey="cpuUsage"
          name="CPU %"
          color={CHART_COLORS.blue}
          yDomain={[0, 100]}
          yLabel="%"
          threshold={80}
        />
        <DualAxisPanel
          title="Run Queue + CPU Ready"
          data={multiSeriesData(selectedMetrics, [
            { key: 'runQueue', values: selectedMetrics.cpu.runQueue },
            { key: 'cpuReady', values: selectedMetrics.cpu.cpuReady },
          ])}
          left={{
            dataKey: 'runQueue',
            name: 'run queue',
            label: 'run queue',
            color: CHART_COLORS.amber,
          }}
          right={{
            dataKey: 'cpuReady',
            name: 'cpu ready',
            label: 'cpu ready (ms)',
            color: CHART_COLORS.purple,
          }}
        />
        <ErrorStatPanel
          title="Throttle"
          statLabel="Throttle Events"
          statValue={throttleEvents}
          statusColor={throttleEvents > 0 ? 'red' : 'green'}
          data={seriesData(
            selectedMetrics,
            'throttlePercent',
            selectedMetrics.cpu.throttlePercent,
          )}
          lines={[
            {
              dataKey: 'throttlePercent',
              name: 'throttle %',
              color: CHART_COLORS.red,
            },
          ]}
          yDomain={[0, 100]}
        />

        <SingleLinePanel
          title="Used Memory %"
          data={seriesData(selectedMetrics, 'memoryUsage', selectedMetrics.memory.usage).map(
            (point) => ({
              ...point,
              oomEventIndices: selectedMetrics.memory.oomEvents,
            }),
          )}
          dataKey="memoryUsage"
          name="memory %"
          color={CHART_COLORS.purple}
          yDomain={[0, 100]}
          yLabel="%"
          threshold={80}
        />
        <DualAxisPanel
          title="Swap Usage + Page Rate"
          data={multiSeriesData(selectedMetrics, [
            { key: 'swapUsageGB', values: selectedMetrics.memory.swapUsageGB },
            { key: 'pageRate', values: selectedMetrics.memory.pageRate },
          ])}
          left={{
            dataKey: 'swapUsageGB',
            name: 'swap GB',
            label: 'swap (GB)',
            color: CHART_COLORS.teal,
          }}
          right={{
            dataKey: 'pageRate',
            name: 'pages/sec',
            label: 'pages/sec',
            color: CHART_COLORS.pink,
          }}
        />
        <ErrorStatPanel
          title="OOM Events"
          statLabel="OOM Events"
          statValue={selectedMetrics.memory.oomCount}
          statusColor={selectedMetrics.memory.oomCount > 0 ? 'red' : 'green'}
          data={seriesData(selectedMetrics, 'memoryUsage', selectedMetrics.memory.usage)}
          lines={[
            {
              dataKey: 'memoryUsage',
              name: 'memory %',
              color: CHART_COLORS.purple,
            },
          ]}
          yDomain={[0, 100]}
          dotRenderer={<OOMDot />}
        />

        <DualAxisPanel
          title="Disk Space % + Throughput"
          data={multiSeriesData(selectedMetrics, [
            { key: 'diskUsage', values: selectedMetrics.disk.usage },
            { key: 'throughputMBs', values: selectedMetrics.disk.throughputMBs },
          ])}
          left={{
            dataKey: 'diskUsage',
            name: 'disk %',
            label: 'disk %',
            color: CHART_COLORS.green,
          }}
          right={{
            dataKey: 'throughputMBs',
            name: 'MB/s',
            label: 'MB/s',
            color: CHART_COLORS.blue,
          }}
        />
        <DualAxisPanel
          title="Queue Depth + IO Wait %"
          data={multiSeriesData(selectedMetrics, [
            { key: 'queueDepth', values: selectedMetrics.disk.queueDepth },
            { key: 'ioWaitPercent', values: selectedMetrics.disk.ioWaitPercent },
          ])}
          left={{
            dataKey: 'queueDepth',
            name: 'queue depth',
            label: 'queue depth',
            color: CHART_COLORS.amber,
          }}
          right={{
            dataKey: 'ioWaitPercent',
            name: 'IO wait %',
            label: 'IO wait %',
            color: CHART_COLORS.red,
          }}
        />
        <ErrorStatPanel
          title="Read/Write Errors"
          statLabel="Disk Errors"
          statValue={diskErrors}
          statusColor={diskErrors > 0 ? 'red' : 'green'}
          data={multiSeriesData(selectedMetrics, [
            { key: 'readErrors', values: selectedMetrics.disk.readErrors },
            { key: 'writeErrors', values: selectedMetrics.disk.writeErrors },
          ])}
          lines={[
            {
              dataKey: 'readErrors',
              name: 'read errors',
              color: CHART_COLORS.amber,
            },
            {
              dataKey: 'writeErrors',
              name: 'write errors',
              color: CHART_COLORS.red,
            },
          ]}
        />

        <MultiLinePanel
          title="Inbound + Outbound Bandwidth"
          data={multiSeriesData(selectedMetrics, [
            { key: 'inboundMBs', values: selectedMetrics.network.inboundMBs },
            { key: 'outboundMBs', values: selectedMetrics.network.outboundMBs },
          ])}
          yLabel="MB/s"
          lines={[
            {
              dataKey: 'inboundMBs',
              name: 'inbound MB/s',
              color: CHART_COLORS.blue,
            },
            {
              dataKey: 'outboundMBs',
              name: 'outbound MB/s',
              color: CHART_COLORS.teal,
            },
          ]}
        />
        <DualAxisPanel
          title="Dropped Packets + Packet Loss %"
          data={multiSeriesData(selectedMetrics, [
            { key: 'droppedPackets', values: selectedMetrics.network.droppedPackets },
            {
              key: 'packetLossPercent',
              values: selectedMetrics.network.packetLossPercent,
            },
          ])}
          left={{
            dataKey: 'droppedPackets',
            name: 'dropped pkts',
            label: 'dropped pkts',
            color: CHART_COLORS.amber,
          }}
          right={{
            dataKey: 'packetLossPercent',
            name: 'loss %',
            label: 'loss %',
            color: CHART_COLORS.red,
          }}
        />
        <ErrorStatPanel
          title="Packet Loss Trend"
          statLabel="Packet Errors"
          statValue={packetErrors}
          statusColor={packetErrors > 0 ? 'red' : 'green'}
          data={seriesData(
            selectedMetrics,
            'packetLossPercent',
            selectedMetrics.network.packetLossPercent,
          )}
          lines={[
            {
              dataKey: 'packetLossPercent',
              name: 'packet loss %',
              color: CHART_COLORS.red,
            },
          ]}
          yDomain={[0, 10]}
        />
      </section>
    </div>
  )
}

export default ServerHealthDashboard
