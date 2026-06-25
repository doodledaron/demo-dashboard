import express from 'express'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import {
  alerts,
  applicationSignals,
  availabilityTimeSeries,
  goldenSignals,
  servers,
} from './src/mockData.js'
import { serverMetricsData } from './src/serverMetrics.js'

const app = express()
const port = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.join(__dirname, 'dist')

app.get('/api/servers', (req, res) => {
  res.json(servers)
})

app.get('/api/application-signals', (req, res) => {
  res.json(applicationSignals)
})

app.get('/api/golden-signals', (req, res) => {
  res.json(goldenSignals)
})

app.get('/api/alerts', (req, res) => {
  res.json(alerts)
})

app.get('/api/availability', (req, res) => {
  res.json(availabilityTimeSeries)
})

app.get('/api/server-metrics', (req, res) => {
  res.json(serverMetricsData)
})

app.get('/api/server-metrics/:serverId', (req, res) => {
  const metrics = serverMetricsData.find(
    (item) => item.serverId === req.params.serverId,
  )

  if (!metrics) {
    res.status(404).json({ error: 'Server metrics not found' })
    return
  }

  res.json(metrics)
})

app.use(express.static(distPath))

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
