/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express'
import { graphqlHTTP } from 'express-graphql'

import { initDB } from './db'
import { schema } from './graphql/schema'

initDB()

const app = express()
app.use(express.json())

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
)

const port = process.env.port || 3333
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`)
})
server.on('error', console.error)
