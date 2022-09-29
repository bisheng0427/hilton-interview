import { createApp, close, createHttpRequest } from '@midwayjs/mock'
import { Framework } from '@midwayjs/koa'

describe('test/controller/guest.test.ts', () => {
  it('should POST /guest/reservation', async () => {
    // create app
    const app = await createApp<Framework>()

    // make request
    const result = await (await createHttpRequest(app).post('/guest/reservation')).body({ guestId: 'bb@test.com', arrivalTime: '2022-10-01', tableSize: 2, status: 'tbd' })

    // use expect by jest
    expect(result.status).toBe(200)
    expect(result.body.message).toBe(true)

    // close app
    await close(app)
  })
})
