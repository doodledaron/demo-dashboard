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
import Panel from './Panel'

const CHART_COLORS = {
  grid: '#1f2937',
  muted: '#6b7280',
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

function ErrorStatPanel({
  title,
  statLabel,
  statValue,
  statusColor,
  data,
  lines,
  yDomain,
  dotRenderer,
}) {
  return (
    <Panel title={title}>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
            {statLabel}
          </p>
          <p
            className={`mt-1 text-3xl font-bold ${
              statusColor === 'red' ? 'text-[#ef4444]' : 'text-[#22c55e]'
            }`}
          >
            {statValue}
          </p>
        </div>
      </div>

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
          />
          <Tooltip content={<DarkTooltip />} />
          {lines.length > 1 ? (
            <Legend
              iconSize={8}
              wrapperStyle={{
                color: CHART_COLORS.muted,
                fontSize: 11,
                paddingTop: 6,
              }}
            />
          ) : null}
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={dotRenderer && index === 0 ? dotRenderer : false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Panel>
  )
}

export default ErrorStatPanel
