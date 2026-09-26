// Local development database — a real PostgreSQL cluster via `embedded-postgres`,
// so no Docker/Homebrew is needed. Production uses a normal Postgres server.
//
//   npm run db        # start (keeps running; Ctrl+C to stop)
//
// Connection string matches DATABASE_URL in .env.example.
import EmbeddedPostgres from 'embedded-postgres'
import path from 'node:path'
import fs from 'node:fs'

const PORT = Number(process.env.DEV_DB_PORT || 54329)
const DB_NAME = process.env.DEV_DB_NAME || 'cushibir'
const dataDir = path.resolve('.data/pg')
const firstRun = !fs.existsSync(path.join(dataDir, 'PG_VERSION'))

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: 'postgres',
  password: 'postgres',
  port: PORT,
  persistent: true,
  // UTF-8 like production (initdb would otherwise pick SQL_ASCII from the C locale).
  initdbFlags: ['--encoding=UTF8', '--locale=C'],
  onLog: () => {},
})

if (firstRun) await pg.initialise()
await pg.start()

const client = pg.getPgClient()
await client.connect()
const { rowCount } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME])
if (!rowCount) await pg.createDatabase(DB_NAME)
await client.end()

// Extensions used for search (pg_trgm) and field encryption helpers (pgcrypto).
const db = pg.getPgClient(DB_NAME)
await db.connect()
await db.query('CREATE EXTENSION IF NOT EXISTS pg_trgm')
await db.query('CREATE EXTENSION IF NOT EXISTS pgcrypto')
await db.end()

console.log(`Postgres ready → postgres://postgres:postgres@127.0.0.1:${PORT}/${DB_NAME}`)

const shutdown = async () => {
  await pg.stop()
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
setInterval(() => {}, 1 << 30)
