import { createApp, close, createHttpRequest } from '@midwayjs/mock'
import { Framework } from '@midwayjs/koa'

describe('test/controller/employee.test.ts', () => {
  it('should POST /employee/reservation', async () => {
    // create app
    const app = await createApp<Framework>()

    // make request
    const result = await await createHttpRequest(app).get('/employee/reservation/1')

    // use expect by jest
    expect(result.status).toBe(200)
    expect(result.body.success).toBe(true)

    // close app
    await close(app)
  })
})
