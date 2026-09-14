import { spawn } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const services = [
  {
    name: 'public site',
    entry: path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'),
    args: ['--host', 'localhost', '--port', '5173', '--strictPort'],
    env: process.env,
  },
  {
    name: 'Decap local backend',
    entry: path.join(root, 'node_modules', 'decap-server', 'dist', 'index.js'),
    args: [],
    env: {
      ...process.env,
      BIND_HOST: '127.0.0.1',
      PORT: '8081',
    },
  },
]

const children = []
let stopping = false

function stop(exitCode = 0) {
  if (stopping) return
  stopping = true

  for (const child of children) {
    if (child.exitCode === null && !child.killed) child.kill()
  }

  process.exitCode = exitCode
}

for (const service of services) {
  const child = spawn(process.execPath, [service.entry, ...service.args], {
    cwd: root,
    env: service.env,
    stdio: 'inherit',
  })

  children.push(child)

  child.on('error', (error) => {
    console.error(`[local] ${service.name} could not start: ${error.message}`)
    stop(1)
  })

  child.on('exit', (code, signal) => {
    if (stopping) return
    const reason = signal ? `signal ${signal}` : `code ${code}`
    console.error(`[local] ${service.name} stopped unexpectedly (${reason}).`)
    stop(code || 1)
  })
}

console.log('[local] Public site: http://localhost:5173/en/')
console.log('[local] Admin:       http://localhost:5173/admin/')
console.log('[local] CMS proxy:   http://127.0.0.1:8081/api/v1')
console.log('[local] Press Ctrl+C to stop both services.')

process.on('SIGINT', () => stop())
process.on('SIGTERM', () => stop())
