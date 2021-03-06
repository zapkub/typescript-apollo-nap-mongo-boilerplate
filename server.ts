import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as chalk from 'chalk'
import { Connection, Model } from 'mongoose'
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express'
import * as next from 'next'
import clientRoutes from './routes'

import graphqlBuildedSchema from './graphql'

declare global {
  interface ApplicationLogger {
    log: (message: string) => void
  }
  interface ApplicationContext {
    config: ApplicationConfig
    logger: ApplicationLogger
    models: ApplicationModels
  }

  interface GraphqlContext extends ApplicationContext, express.Request {

  }
}

export default async function init(context: ApplicationContext) {
  const server = express()
  const clientApp = next({ dev: context.config.dev })
  const clientRoutesHandler = clientRoutes.getRequestHandler(clientApp)
  server.use(bodyParser.json())
  server.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
  server.use('/graphql', graphqlExpress( (req) => ({
    schema: graphqlBuildedSchema(context.models),
    context: {
      ...req,
      ...context
    }
  })))
  server.use(clientRoutesHandler)
  return {
    start: async () => {
      await clientApp.prepare()
      server.listen(context.config.PORT, () => {
        context.logger.log(chalk.bgGreen(`Start application !!`))
        context.logger.log(chalk.green(`Application start on port =>> ${context.config.PORT}`))
      })
    }
  }
}
