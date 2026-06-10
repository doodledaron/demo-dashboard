const timePoints = Array.from({ length: 60 }, (_, index) => {
  const totalMinutes = 15 * 60 + index
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
  const minutes = String(totalMinutes % 60).padStart(2, '0')

  return `${hours}:${minutes}`
})

const round1 = (value) => Math.round(value * 10) / 10

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const spike = (index, center, width, height) =>
  height * Math.max(0, 1 - Math.abs(index - center) / width)

const processNames = [
  'api-gateway',
  'worker-sync',
  'postgres',
  'redis-cache',
  'nginx',
  'audit-writer',
  'queue-consumer',
  'metrics-agent',
]

const generateProcesses = (server, serverIndex) =>
  processNames.map((name, index) => {
    const pressureFactor = index < 3 ? 1.35 : 0.82
    const cpuPercent = round1(
      clamp(
        3 + index * 2.4 + server.cpuBase * 0.16 * pressureFactor + (index === 0 ? 18 : 0),
        1,
        98,
      ),
    )
    const memoryMB = Math.round(
      clamp(
        220 + index * 140 + server.memoryBase * 22 * pressureFactor + (index === 2 ? 2600 : 0),
        120,
        8192,
      ),
    )
    const diskMBs = round1(
      clamp(
        1.5 + index * 1.8 + server.diskBase * 0.16 * pressureFactor + (index === 5 ? 42 : 0),
        0.2,
        120,
      ),
    )
    const networkMBs = round1(
      clamp(
        0.8 + index * 1.1 + serverIndex * 1.4 + (index === 0 ? 36 : 0) + (index === 6 ? 18 : 0),
        0.1,
        96,
      ),
    )

    return {
      pid: 2400 + serverIndex * 100 + index * 17,
      name,
      cpuPercent,
      memoryMB,
      diskMBs,
      networkMBs,
    }
  })

const generateSeries = (server) => {
  const cpuSpike = (index) =>
    spike(index, server.cpuSpikeIndex, 6, server.cpuSpikeHeight) +
    spike(index, server.cpuSpikeIndex + 21, 4, server.cpuSpikeHeight * 0.45)
  const memorySpike = (index) => spike(index, server.memorySpikeIndex, 8, server.memorySpikeHeight)
  const diskSpike = (index) =>
    spike(index, server.diskSpikeIndex, 5, server.diskSpikeHeight) +
    spike(index, server.diskSpikeIndex + 18, 4, server.diskSpikeHeight * 0.5)
  const networkSpike = (index) =>
    spike(index, server.networkSpikeIndex, 4, server.networkSpikeHeight)

  const cpuUsage = timePoints.map((_, index) =>
    round1(
      clamp(
        server.cpuBase + Math.sin(index / 5) * 5 + Math.cos(index / 9) * 2 + cpuSpike(index),
        32,
        97,
      ),
    ),
  )
  const memoryUsage = timePoints.map((_, index) =>
    round1(
      clamp(
        server.memoryBase + index * 0.08 + Math.sin(index / 7) * 4 + memorySpike(index),
        45,
        96,
      ),
    ),
  )
  const diskUsage = timePoints.map((_, index) =>
    round1(clamp(server.diskBase + index * 0.16 + Math.sin(index / 12) * 1.4, 48, 72)),
  )
  const queueDepth = timePoints.map((_, index) =>
    round1(clamp(1.2 + Math.sin(index / 6) * 1.1 + diskSpike(index) / 6, 0, 20)),
  )
  const droppedPackets = timePoints.map((_, index) =>
    Math.round(
      clamp(
        (networkSpike(index) > 0 ? networkSpike(index) / 4 : 0) +
          (index === server.networkSpikeIndex + 12 ? 9 : 0),
        0,
        18,
      ),
    ),
  )
  const processCount = timePoints.map((_, index) =>
    Math.round(
      clamp(
        server.processBase +
          Math.sin(index / 8) * 8 +
          cpuSpike(index) * 0.28 +
          memorySpike(index) * 0.18,
        90,
        260,
      ),
    ),
  )

  return {
    serverId: server.serverId,
    timePoints,
    processes: {
      count: processCount,
      topProcesses: generateProcesses(server, server.serverIndex),
    },
    cpu: {
      usage: cpuUsage,
      runQueue: cpuUsage.map((value, index) =>
        round1(clamp(value / 18 + cpuSpike(index) / 10 - 1.7, 0.4, 8)),
      ),
      cpuReady: cpuUsage.map((value, index) =>
        round1(clamp(value / 8 + cpuSpike(index) / 4, 3, 20)),
      ),
      throttlePercent: cpuUsage.map((value, index) =>
        round1(clamp(Math.max(0, value - 70) * 0.75 + cpuSpike(index) / 2.2, 0, 36)),
      ),
      throttleEvents: cpuUsage.map((value, index) =>
        Math.round(clamp(value > 82 ? (value - 78) / 2 + cpuSpike(index) / 6 : 0, 0, 15)),
      ),
    },
    memory: {
      usage: memoryUsage,
      swapUsageGB: memoryUsage.map((value, index) =>
        round1(clamp(Math.max(0, value - 68) / 4 + memorySpike(index) / 12, 0, 8)),
      ),
      pageRate: memoryUsage.map((value, index) =>
        Math.round(clamp(Math.max(0, value - 62) * 6 + memorySpike(index) * 8, 0, 500)),
      ),
      oomCount: server.oomEvents.length,
      oomEvents: server.oomEvents,
    },
    disk: {
      usage: diskUsage,
      throughputMBs: timePoints.map((_, index) =>
        round1(clamp(24 + Math.sin(index / 4) * 12 + diskSpike(index) * 5, 10, 200)),
      ),
      queueDepth,
      ioWaitPercent: queueDepth.map((value) => round1(clamp(value * 2.4, 0, 40))),
      readErrors: timePoints.map((_, index) =>
        index === server.diskSpikeIndex + 2 ? server.readErrorSpike : 0,
      ),
      writeErrors: timePoints.map((_, index) =>
        index === server.diskSpikeIndex + 19 ? server.writeErrorSpike : 0,
      ),
    },
    network: {
      inboundMBs: timePoints.map((_, index) =>
        round1(clamp(34 + Math.sin(index / 6) * 14 + networkSpike(index) * 2.8, 10, 150)),
      ),
      outboundMBs: timePoints.map((_, index) =>
        round1(clamp(18 + Math.cos(index / 8) * 8 + networkSpike(index) * 1.3, 5, 80)),
      ),
      droppedPackets,
      packetLossPercent: droppedPackets.map((value) =>
        round1(clamp(value === 0 ? 0.1 : value * 0.32, 0, 5)),
      ),
      packetErrors: droppedPackets.map((value, index) =>
        Math.round(clamp(value / 3 + (index === server.networkSpikeIndex + 1 ? 4 : 0), 0, 12)),
      ),
    },
  }
}

export const serverMetricsData = [
  generateSeries({
    serverId: 'server-01',
    serverIndex: 0,
    processBase: 138,
    cpuBase: 54,
    memoryBase: 58,
    diskBase: 51,
    cpuSpikeIndex: 18,
    cpuSpikeHeight: 38,
    memorySpikeIndex: 39,
    memorySpikeHeight: 31,
    diskSpikeIndex: 27,
    diskSpikeHeight: 22,
    networkSpikeIndex: 45,
    networkSpikeHeight: 28,
    readErrorSpike: 2,
    writeErrorSpike: 1,
    oomEvents: [39],
  }),
  generateSeries({
    serverId: 'server-02',
    serverIndex: 1,
    processBase: 162,
    cpuBase: 63,
    memoryBase: 68,
    diskBase: 58,
    cpuSpikeIndex: 13,
    cpuSpikeHeight: 34,
    memorySpikeIndex: 24,
    memorySpikeHeight: 25,
    diskSpikeIndex: 36,
    diskSpikeHeight: 28,
    networkSpikeIndex: 31,
    networkSpikeHeight: 32,
    readErrorSpike: 3,
    writeErrorSpike: 4,
    oomEvents: [24, 47],
  }),
  generateSeries({
    serverId: 'server-11',
    serverIndex: 2,
    processBase: 176,
    cpuBase: 66,
    memoryBase: 70,
    diskBase: 60,
    cpuSpikeIndex: 21,
    cpuSpikeHeight: 31,
    memorySpikeIndex: 43,
    memorySpikeHeight: 23,
    diskSpikeIndex: 16,
    diskSpikeHeight: 30,
    networkSpikeIndex: 28,
    networkSpikeHeight: 36,
    readErrorSpike: 5,
    writeErrorSpike: 2,
    oomEvents: [23, 43],
  }),
]
