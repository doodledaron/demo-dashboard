import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Panel from './Panel'

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-md border border-gray-800 bg-[#111827] px-3 py-2 shadow-xl">
      <p className="text-xs text-[#6b7280]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#f9fafb]">
        {payload[0].value.toFixed(1)}%
      </p>
    </div>
  )
}

function AvailabilityTrendPanel({ data }) {
  return (
    <Panel title="Availability Trend" className="h-[360px]">
      <div className="h-[292px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="availabilityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.42} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#1f2937' }}
              minTickGap={18}
            />
            <YAxis
              domain={[85, 100]}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              axisLine={{ stroke: '#1f2937' }}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#374151' }} />
            <Area
              type="monotone"
              dataKey="availability"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#availabilityFill)"
              activeDot={{ r: 4, stroke: '#93c5fd', fill: '#3b82f6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}

export default AvailabilityTrendPanel
