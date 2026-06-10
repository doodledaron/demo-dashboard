const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

const timePoints = Array.from({ length: 30 }, (_, index) => {
  const totalMinutes = 14 * 60 + index * 5
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
  const minutes = String(totalMinutes % 60).padStart(2, '0')

  return `${hours}:${minutes}`
})

const ENVS = ['PROD', 'DR']

const round1 = (value) => Math.round(value * 10) / 10

const round2 = (value) => Math.round(value * 100) / 100

const sum = (values) => values.reduce((total, value) => total + value, 0)

export const servers = [
  {
    id: 'server-01',
    name: 'srv-01',
    app: 'New Wallet',
    env: 'PROD',
    status: 'up',
    uptime: 99.4,
    availability30d: 99.2,
    hostname: 'prod-srv-01.internal',
    instance: 'c5.2xlarge',
    os: 'Ubuntu 22.04',
    cpuCores: 8,
    cpuUsage: 61.8,
    totalMemory: '32 GB',
    memoryUsage: 68.4,
    diskSpace: '500 GB',
    diskUsage: 56.2,
  },
  {
    id: 'server-02',
    name: 'srv-02',
    app: 'New Wallet',
    env: 'PROD',
    status: 'down',
    uptime: 87.6,
    availability30d: 91.8,
    hostname: 'prod-srv-02.internal',
    instance: 'c5.2xlarge',
    os: 'Ubuntu 22.04',
    cpuCores: 8,
    cpuUsage: 91.4,
    totalMemory: '32 GB',
    memoryUsage: 88.7,
    diskSpace: '500 GB',
    diskUsage: 72.5,
  },
  {
    id: 'server-03',
    name: 'srv-03',
    app: 'LMS',
    env: 'PROD',
    status: 'up',
    uptime: 97.9,
    availability30d: 97.4,
    hostname: 'prod-srv-03.internal',
    instance: 'm6i.2xlarge',
    os: 'Amazon Linux 2023',
    cpuCores: 8,
    cpuUsage: 73.2,
    totalMemory: '32 GB',
    memoryUsage: 64.9,
    diskSpace: '750 GB',
    diskUsage: 62.8,
  },
  {
    id: 'server-04',
    name: 'srv-04',
    app: 'LMS',
    env: 'PROD',
    status: 'up',
    uptime: 98.8,
    availability30d: 98.5,
    hostname: 'prod-srv-04.internal',
    instance: 'm6i.4xlarge',
    os: 'Amazon Linux 2023',
    cpuCores: 16,
    cpuUsage: 58.6,
    totalMemory: '64 GB',
    memoryUsage: 76.3,
    diskSpace: '1 TB',
    diskUsage: 52.1,
  },
  {
    id: 'server-05',
    name: 'srv-05',
    app: 'DMS',
    env: 'PROD',
    status: 'up',
    uptime: 96.5,
    availability30d: 96.1,
    hostname: 'prod-srv-05.internal',
    instance: 'r6i.2xlarge',
    os: 'Red Hat Enterprise Linux 9',
    cpuCores: 8,
    cpuUsage: 66.5,
    totalMemory: '64 GB',
    memoryUsage: 81.9,
    diskSpace: '1 TB',
    diskUsage: 84.6,
  },
  {
    id: 'server-06',
    name: 'srv-06',
    app: 'DMS',
    env: 'PROD',
    status: 'up',
    uptime: 99.1,
    availability30d: 98.7,
    hostname: 'prod-srv-06.internal',
    instance: 'r6i.4xlarge',
    os: 'Red Hat Enterprise Linux 9',
    cpuCores: 16,
    cpuUsage: 49.7,
    totalMemory: '128 GB',
    memoryUsage: 57.4,
    diskSpace: '2 TB',
    diskUsage: 47.9,
  },
  {
    id: 'server-07',
    name: 'srv-07',
    app: 'MOS',
    env: 'PROD',
    status: 'up',
    uptime: 95.8,
    availability30d: 95.2,
    hostname: 'prod-srv-07.internal',
    instance: 'c6i.2xlarge',
    os: 'Ubuntu 22.04',
    cpuCores: 8,
    cpuUsage: 78.4,
    totalMemory: '32 GB',
    memoryUsage: 83.1,
    diskSpace: '750 GB',
    diskUsage: 67.3,
  },
  {
    id: 'server-08',
    name: 'srv-08',
    app: 'MOS',
    env: 'PROD',
    status: 'up',
    uptime: 98.2,
    availability30d: 97.8,
    hostname: 'prod-srv-08.internal',
    instance: 'c6i.4xlarge',
    os: 'Ubuntu 22.04',
    cpuCores: 16,
    cpuUsage: 52.6,
    totalMemory: '64 GB',
    memoryUsage: 61.2,
    diskSpace: '1 TB',
    diskUsage: 59.7,
  },
  {
    id: 'server-09',
    name: 'srv-09',
    app: 'New Wallet',
    env: 'DR',
    status: 'up',
    uptime: 97.3,
    availability30d: 96.8,
    hostname: 'dr-srv-01.internal',
    instance: 'c5.xlarge',
    os: 'Ubuntu 22.04',
    cpuCores: 4,
    cpuUsage: 45.6,
    totalMemory: '16 GB',
    memoryUsage: 54.8,
    diskSpace: '300 GB',
    diskUsage: 48.5,
  },
  {
    id: 'server-10',
    name: 'srv-10',
    app: 'New Wallet',
    env: 'DR',
    status: 'up',
    uptime: 96.7,
    availability30d: 95.9,
    hostname: 'dr-srv-02.internal',
    instance: 'c5.xlarge',
    os: 'Ubuntu 22.04',
    cpuCores: 4,
    cpuUsage: 69.4,
    totalMemory: '16 GB',
    memoryUsage: 72.1,
    diskSpace: '300 GB',
    diskUsage: 64.8,
  },
  {
    id: 'server-11',
    name: 'srv-11',
    app: 'LMS',
    env: 'DR',
    status: 'down',
    uptime: 81.9,
    availability30d: 88.9,
    hostname: 'dr-srv-03.internal',
    instance: 'm6i.xlarge',
    os: 'Amazon Linux 2023',
    cpuCores: 4,
    cpuUsage: 88.8,
    totalMemory: '16 GB',
    memoryUsage: 91.5,
    diskSpace: '500 GB',
    diskUsage: 89.4,
  },
  {
    id: 'server-12',
    name: 'srv-12',
    app: 'LMS',
    env: 'DR',
    status: 'up',
    uptime: 97.1,
    availability30d: 96.2,
    hostname: 'dr-srv-04.internal',
    instance: 'm6i.xlarge',
    os: 'Amazon Linux 2023',
    cpuCores: 4,
    cpuUsage: 57.3,
    totalMemory: '16 GB',
    memoryUsage: 63.2,
    diskSpace: '500 GB',
    diskUsage: 50.6,
  },
  {
    id: 'server-13',
    name: 'srv-13',
    app: 'DMS',
    env: 'DR',
    status: 'up',
    uptime: 98.4,
    availability30d: 97.6,
    hostname: 'dr-srv-05.internal',
    instance: 'r6i.xlarge',
    os: 'Red Hat Enterprise Linux 9',
    cpuCores: 4,
    cpuUsage: 62.5,
    totalMemory: '32 GB',
    memoryUsage: 66.7,
    diskSpace: '750 GB',
    diskUsage: 53.8,
  },
  {
    id: 'server-14',
    name: 'srv-14',
    app: 'DMS',
    env: 'DR',
    status: 'up',
    uptime: 95.4,
    availability30d: 94.6,
    hostname: 'dr-srv-06.internal',
    instance: 'r6i.xlarge',
    os: 'Red Hat Enterprise Linux 9',
    cpuCores: 4,
    cpuUsage: 76.9,
    totalMemory: '32 GB',
    memoryUsage: 79.8,
    diskSpace: '750 GB',
    diskUsage: 86.1,
  },
  {
    id: 'server-15',
    name: 'srv-15',
    app: 'MOS',
    env: 'DR',
    status: 'down',
    uptime: 84.6,
    availability30d: 90.5,
    hostname: 'dr-srv-07.internal',
    instance: 'c6i.xlarge',
    os: 'Ubuntu 22.04',
    cpuCores: 4,
    cpuUsage: 93.2,
    totalMemory: '16 GB',
    memoryUsage: 87.6,
    diskSpace: '500 GB',
    diskUsage: 78.4,
  },
  {
    id: 'server-16',
    name: 'srv-16',
    app: 'MOS',
    env: 'DR',
    status: 'up',
    uptime: 96.8,
    availability30d: 95.7,
    hostname: 'dr-srv-08.internal',
    instance: 'c6i.xlarge',
    os: 'Ubuntu 22.04',
    cpuCores: 4,
    cpuUsage: 55.4,
    totalMemory: '16 GB',
    memoryUsage: 58.9,
    diskSpace: '500 GB',
    diskUsage: 61.3,
  },
]

const appTrafficFactor = {
  'New Wallet': 1.18,
  LMS: 1.05,
  DMS: 0.92,
  MOS: 0.84,
}

const serverAppSignalSeries = (server, serverIndex) => {
  const envFactor = server.env === 'PROD' ? 1.7 : 0.95
  const statusFactor = server.status === 'down' ? 0.42 : 1
  const baseRequestsPerSecond =
    (72 + (serverIndex % 5) * 9) * envFactor * appTrafficFactor[server.app] * statusFactor
  const baseErrorRate =
    server.status === 'down'
      ? 0.048
      : server.cpuUsage > 85 || server.memoryUsage > 85
        ? 0.018
        : 0.006
  const baseLatency = 42 + serverIndex * 1.7 + Math.max(0, server.cpuUsage - 60) * 0.55

  return timePoints.map((time, index) => {
    const wave = 1 + Math.sin(index / 4 + serverIndex) * 0.12
    const incidentFactor = index >= 10 && index <= 13 ? 1 : 0
    const requestDip = server.status === 'down' && incidentFactor ? 0.52 : 1
    const requestsPerSecond = round1(baseRequestsPerSecond * wave * requestDip)
    const totalRequests = Math.max(1, Math.round(requestsPerSecond * 60))
    const incidentErrorRate = incidentFactor * (server.status === 'down' ? 0.065 : 0.012)
    const pressureErrorRate = Math.max(0, server.cpuUsage - 80) / 5000
    const failedRequests = Math.round(
      totalRequests * (baseErrorRate + incidentErrorRate + pressureErrorRate),
    )
    const latencySpike = incidentFactor * (server.status === 'down' ? 82 : 24)
    const p50 = round1(baseLatency + wave * 5 + latencySpike * 0.25)
    const p95 = round1(p50 * 2.35 + latencySpike)
    const p99 = round1(p50 * 4.4 + latencySpike * 2.15)

    return {
      time,
      requestsPerSecond,
      totalRequests,
      failedRequests,
      p50,
      p95,
      p99,
    }
  })
}

export const applicationSignals = servers.map((server, serverIndex) => {
  const diskIo = round1(
    Math.min(98, server.diskUsage * 0.62 + server.cpuUsage * 0.24 + (server.status === 'down' ? 14 : 0)),
  )
  const networkBandwidth = round1(
    Math.min(
      98,
      34 +
        serverIndex * 2.1 +
        (server.env === 'PROD' ? 16 : 5) +
        (server.status === 'down' ? 18 : 0),
    ),
  )

  return {
    serverId: server.id,
    server: server.name,
    hostname: server.hostname,
    app: server.app,
    env: server.env,
    series: serverAppSignalSeries(server, serverIndex),
    saturation: {
      cpu: server.cpuUsage,
      memory: server.memoryUsage,
      diskIo,
      networkBandwidth,
    },
  }
})

const weightedAverageAt = (signals, index, metric) => {
  const totalRequests = sum(
    signals.map((signal) => signal.series[index].totalRequests),
  )

  return round1(
    sum(
      signals.map(
        (signal) => signal.series[index][metric] * signal.series[index].totalRequests,
      ),
    ) / totalRequests,
  )
}

const aggregateGoldenSignal = (env) => {
  const signals = applicationSignals.filter((signal) => signal.env === env)

  return {
    env,
    traffic: timePoints.map((time, index) => ({
      time,
      requestsPerSec: round1(
        sum(signals.map((signal) => signal.series[index].requestsPerSecond)),
      ),
    })),
    errors: timePoints.map((time, index) => {
      const totalRequests = sum(
        signals.map((signal) => signal.series[index].totalRequests),
      )
      const failedRequests = sum(
        signals.map((signal) => signal.series[index].failedRequests),
      )

      return {
        time,
        errorRate: round2((failedRequests / totalRequests) * 100),
        failedRequests,
        totalRequests,
      }
    }),
    latency: timePoints.map((time, index) => ({
      time,
      p50: weightedAverageAt(signals, index, 'p50'),
      p95: weightedAverageAt(signals, index, 'p95'),
      p99: weightedAverageAt(signals, index, 'p99'),
    })),
    saturation: signals.map((signal) => signal.saturation),
  }
}

export const goldenSignals = ENVS.map((env) => aggregateGoldenSignal(env))

export const alerts = [
  {
    id: 'alert-01',
    env: 'PROD',
    severity: 'critical',
    message: 'Node unreachable after repeated health check failures',
    server: 'srv-02',
    timestamp: hoursAgo(1.2),
  },
  {
    id: 'alert-02',
    env: 'PROD',
    severity: 'critical',
    message: 'Authentication service latency above incident threshold',
    server: 'srv-03',
    timestamp: hoursAgo(2.6),
  },
  {
    id: 'alert-03',
    env: 'PROD',
    severity: 'warning',
    message: 'Disk utilization exceeded 82% on primary volume',
    server: 'srv-05',
    timestamp: hoursAgo(4.1),
  },
  {
    id: 'alert-04',
    env: 'PROD',
    severity: 'warning',
    message: 'Memory pressure detected during scheduled batch window',
    server: 'srv-07',
    timestamp: hoursAgo(5.8),
  },
  {
    id: 'alert-05',
    env: 'DR',
    severity: 'critical',
    message: 'Report worker queue stalled for more than 15 minutes',
    server: 'srv-11',
    timestamp: hoursAgo(7.4),
  },
  {
    id: 'alert-06',
    env: 'DR',
    severity: 'warning',
    message: 'API error rate trending above normal baseline',
    server: 'srv-14',
    timestamp: hoursAgo(10.3),
  },
  {
    id: 'alert-07',
    env: 'DR',
    severity: 'critical',
    message: 'Failover listener unavailable during synthetic probe',
    server: 'srv-15',
    timestamp: hoursAgo(14.9),
  },
  {
    id: 'alert-08',
    env: 'DR',
    severity: 'warning',
    message: 'TLS certificate renewal job missed expected check-in',
    server: 'srv-10',
    timestamp: hoursAgo(21.7),
  },
]

export const availabilityTimeSeries = [
  { date: 'May 12', availability: 98.8 },
  { date: 'May 13', availability: 99.1 },
  { date: 'May 14', availability: 98.5 },
  { date: 'May 15', availability: 97.9 },
  { date: 'May 16', availability: 99.3 },
  { date: 'May 17', availability: 98.7 },
  { date: 'May 18', availability: 96.8 },
  { date: 'May 19', availability: 94.2 },
  { date: 'May 20', availability: 97.4 },
  { date: 'May 21', availability: 98.1 },
  { date: 'May 22', availability: 99.0 },
  { date: 'May 23', availability: 98.6 },
  { date: 'May 24', availability: 97.7 },
  { date: 'May 25', availability: 96.1 },
  { date: 'May 26', availability: 92.9 },
  { date: 'May 27', availability: 95.6 },
  { date: 'May 28', availability: 98.4 },
  { date: 'May 29', availability: 99.2 },
  { date: 'May 30', availability: 98.9 },
  { date: 'May 31', availability: 97.8 },
  { date: 'Jun 01', availability: 96.9 },
  { date: 'Jun 02', availability: 98.3 },
  { date: 'Jun 03', availability: 99.4 },
  { date: 'Jun 04', availability: 98.6 },
  { date: 'Jun 05', availability: 95.8 },
  { date: 'Jun 06', availability: 89.7 },
  { date: 'Jun 07', availability: 94.8 },
  { date: 'Jun 08', availability: 97.1 },
  { date: 'Jun 09', availability: 98.5 },
  { date: 'Jun 10', availability: 96.6 },
]
