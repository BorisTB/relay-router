import * as jsonServer from 'json-server'
import { getDbData } from './getDbData'

const DB_PORT = process.env.NX_DB_PORT

export function initDB(): void {
  const data = getDbData()
  const server = jsonServer.create()
  const router = jsonServer.router(data)

  server.use(jsonServer.defaults())
  server.use(jsonServer.bodyParser)

  server.use(router)

  server.listen(DB_PORT, () => {
    console.log(`JSON Server is running on http://localhost:${DB_PORT}/`)
  })
}
