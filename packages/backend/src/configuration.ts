import { Configuration, App, Inject } from '@midwayjs/decorator'
import * as koa from '@midwayjs/koa'
import * as validate from '@midwayjs/validate'
import * as info from '@midwayjs/info'
import { join } from 'path'
import * as swagger from '@midwayjs/swagger'
import * as jwt from '@midwayjs/jwt'
// import * as redis from '@midwayjs/redis'

import { ReportMiddleware } from './middleware/report.middleware'
import CouchbaseManager from './utils/couchbase'
import { DefaultErrorFilter } from './filter/default.filter'
import { NotFoundFilter } from './filter/notfound.filter'

@Configuration({
  imports: [
    koa,
    validate,
    swagger,
    jwt,
    // redis,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    {
      component: swagger,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application

  // init db connection
  @Inject()
  dbManager: CouchbaseManager

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware])
    this.app.useFilter([DefaultErrorFilter, NotFoundFilter])
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
