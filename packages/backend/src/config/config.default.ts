import { MidwayConfig } from '@midwayjs/core'

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1664192430787_8637',
  koa: {
    port: 7001,
  },
  jwt: {
    secret: '1664192430787_8637', // fs.readFileSync('xxxxx.key')
    expiresIn: '2d', // https://github.com/vercel/ms
  },
  couchbase: {
    host: 'couchbase://127.0.0.1',
    username: 'bb',
    password: 'testbb',
    bucket: 'resturant',
  },
  swagger: {
    auth: {
      authType: 'bearer',
    },
  },
  redis: {
    client: {
      port: 6379,
      host: '127.0.0.1', // Redis host
      password: '',
      db: 0,
    },
  },
} as MidwayConfig
