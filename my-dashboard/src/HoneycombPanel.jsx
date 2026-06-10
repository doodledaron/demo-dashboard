import { useMemo, useRef, useState } from 'react'
import Panel from './Panel'

const hexPoints = (cx, cy, r) =>
  Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30)
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
  }).join(' ')

const groupByApp = (servers) =>
  servers.reduce((groups, server) => {
    if (!groups[server.app]) {
      groups[server.app] = []
    }

    groups[server.app].push(server)
    return groups
  }, {})

function AppHoneycombTile({ app, servers, onHover, onLeave, onServerSelect }) {
  const radius = 34
  const hexWidth = Math.sqrt(3) * radius
  const yStep = 1.5 * radius
  const svgWidth = 215
  const svgHeight = 175

  return (
    <div className="w-[260px] shrink-0 rounded-md border border-gray-800 bg-[#030712]/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-[#f9fafb]">
          {app}
        </h4>
        <span className="text-xs text-[#6b7280]">{servers.length} servers</span>
      </div>

      <svg
        role="img"
        aria-label={`${app} server health honeycomb`}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="h-[175px] w-full text-[#f9fafb]"
      >
        {servers.map((server, index) => {
          const row = Math.floor(index / 2)
          const column = index % 2
          const cx = 48 + column * hexWidth + (row % 2 ? hexWidth / 2 : 0)
          const cy = 46 + row * yStep
          const isDown = server.status === 'down'

          return (
            <g
              key={server.id}
              className={onServerSelect ? 'cursor-pointer' : 'cursor-default'}
              onMouseMove={(event) => onHover(event, server)}
              onMouseLeave={onLeave}
              onClick={() => onServerSelect?.(server.id)}
              role={onServerSelect ? 'button' : undefined}
              tabIndex={onServerSelect ? 0 : undefined}
              onKeyDown={(event) => {
                if (onServerSelect && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault()
                  onServerSelect(server.id)
                }
              }}
            >
              <polygon
                points={hexPoints(cx, cy, radius)}
                fill={isDown ? '#ef4444' : '#22c55e'}
                stroke={isDown ? '#fecaca' : '#bbf7d0'}
                strokeOpacity="0.5"
                strokeWidth="1.5"
              />
              <text
                x={cx}
                y={cy - 4}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="12"
                fontWeight="700"
                pointerEvents="none"
              >
                {server.name}
              </text>
              <text
                x={cx}
                y={cy + 13}
                textAnchor="middle"
                fill="#e5e7eb"
                fontSize="10"
                pointerEvents="none"
              >
                {server.availability30d.toFixed(1)}%
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function HoneycombPanel({ servers, onServerSelect }) {
  const containerRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)
  const groups = useMemo(() => Object.entries(groupByApp(servers)), [servers])

  const handleMove = (event, server) => {
    const bounds = containerRef.current.getBoundingClientRect()

    setTooltip({
      server,
      x: event.clientX - bounds.left + 14,
      y: event.clientY - bounds.top + 14,
    })
  }

  return (
    <Panel title="App Status">
      <div ref={containerRef} className="relative overflow-x-auto">
        <div className="flex w-max flex-nowrap gap-4">
          {groups.map(([app, appServers]) => (
            <AppHoneycombTile
              key={app}
              app={app}
              servers={appServers}
              onHover={handleMove}
              onLeave={() => setTooltip(null)}
              onServerSelect={onServerSelect}
            />
          ))}
        </div>

        {tooltip ? (
          <div
            className="pointer-events-none absolute z-10 w-56 rounded-md border border-gray-700 bg-[#111827] p-3 text-sm shadow-2xl"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <p className="font-semibold text-[#f9fafb]">{tooltip.server.name}</p>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
              <dt className="text-[#6b7280]">App</dt>
              <dd className="text-right text-gray-200">{tooltip.server.app}</dd>
              <dt className="text-[#6b7280]">Status</dt>
              <dd className="text-right text-gray-200">{tooltip.server.status}</dd>
              <dt className="text-[#6b7280]">Uptime</dt>
              <dd className="text-right text-gray-200">
                {tooltip.server.uptime.toFixed(1)}%
              </dd>
              <dt className="text-[#6b7280]">30d Availability</dt>
              <dd className="text-right text-gray-200">
                {tooltip.server.availability30d.toFixed(1)}%
              </dd>
            </dl>
          </div>
        ) : null}
      </div>
    </Panel>
  )
}

export default HoneycombPanel
