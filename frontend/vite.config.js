import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const DB_PATH = resolve(__dirname, 'db.json')

const createUsersMiddleware = (logError) => {
  return (req, res, next) => {
    if (!['GET', 'POST', 'OPTIONS'].includes(req.method ?? '')) {
      res.statusCode = 405
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ message: 'Method Not Allowed' }))
      return
    }

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      res.end()
      return
    }

    const readUsers = () => {
      try {
        const dbRaw = readFileSync(DB_PATH, 'utf8')
        const parsed = JSON.parse(dbRaw || '{}')
        return Array.isArray(parsed.users) ? parsed.users : []
      } catch (error) {
        logError(`Không thể đọc file db.json: ${error}`)
        return []
      }
    }

    const writeUsers = (users) => {
      try {
        writeFileSync(DB_PATH, JSON.stringify({ users }, null, 2), 'utf8')
      } catch (error) {
        logError(`Không thể ghi file db.json: ${error}`)
        throw error
      }
    }

    if (req.method === 'GET') {
      const users = readUsers()
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(users))
      return
    }

    if (req.method === 'POST') {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk
      })
      req.on('end', () => {
        try {
          const payload = body ? JSON.parse(body) : {}
          if (!payload || typeof payload !== 'object') {
            throw new Error('Invalid payload')
          }

          const users = readUsers()
          const userWithId = {
            id: payload.id ?? Date.now(),
            ...payload,
          }
          users.push(userWithId)
          writeUsers(users)

          res.statusCode = 201
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(userWithId))
        } catch (error) {
          logError(`Lỗi lưu người dùng: ${error}`)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ message: 'Không thể lưu người dùng mới' }))
        }
      })
      return
    }

    next()
  }
}

const authApiPlugin = {
  name: 'local-auth-api',
  configureServer(server) {
    const logger = server.config.logger
    const logError = (message) => {
      if (logger && typeof logger.error === 'function') {
        logger.error(message)
      } else {
        console.error(message)
      }
    }

    server.middlewares.use('/api/users', createUsersMiddleware(logError))
  },
  configurePreviewServer(server) {
    server.middlewares.use('/api/users', createUsersMiddleware((message) => console.error(message)))
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), authApiPlugin],
})
