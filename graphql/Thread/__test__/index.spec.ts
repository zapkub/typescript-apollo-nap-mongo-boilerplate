import { Connection, Types } from 'mongoose'
import { initConnection } from '../../../lib/db.connection'
import config from '../../../config'
import { createModelsFromMongooseConnection } from '../../../models'
import { createThreadWrapResolver } from '../create.resolver'

describe('Thread resolver test', () => {
  let connection: Connection;
  let models: ApplicationModels;
  beforeAll(async () => {
    connection = await initConnection({
      config,
      logger: console
    })
    models = createModelsFromMongooseConnection(connection)
  })
  afterAll(async () => {
    await connection.close()
  })

  it('should create new Thread if Thread not found', async () => {
    const threadId = Types.ObjectId()
    const rp = {
      source: undefined,
      args: {
        appId: 'mock-app',
        contentId: threadId
      },
      context: {
        logger: console,
        models
      }
    }
    await createThreadWrapResolver(() => {
      return undefined
    })(rp)

    const thread = await models.Thread.findOne({
      appId: 'mock-app',
      contentId: threadId
    })

    expect(thread).toEqual(expect.anything())
    await models.Thread.remove({
      appId: 'mock-app'
    })
  })

})
