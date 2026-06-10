import Panel from './Panel'

const statusTextClasses = {
  green: 'text-[#22c55e]',
  amber: 'text-[#f59e0b]',
  red: 'text-[#ef4444]',
  blue: 'text-[#3b82f6]',
}

function StatCard({ label, value, statusColor }) {
  return (
    <Panel>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
          {label}
        </p>
        <p
          className={`mt-3 text-3xl font-bold ${
            statusTextClasses[statusColor] ?? 'text-[#f9fafb]'
          }`}
        >
          {value}
        </p>
      </div>
    </Panel>
  )
}

export default StatCard
