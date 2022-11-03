import { Configuration, App, Inject } from '@midwayjs/decorator'
import * as koa from '@midwayjs/koa'
import * as validate from '@midwayjs/validate'
import * as info from '@midwayjs/info'
import { join } from 'path'
import * as swagger from '@midwayjs/swagger'
import * as jwt from '@midwayjs/jwt'
import { ApolloServer } from 'apollo-server-koa'
import { readFileSync } from 'fs'

import { ReportMiddleware } from './middleware/report.middleware'
import CouchbaseManager from './utils/couchbase'
import { DefaultErrorFilter } from './filter/default.filter'
import { NotFoundFilter } from './filter/notfound.filter'
import { resolvers } from './graphql/resolver'
import { IMidwayContainer } from '@midwayjs/core'

const typeDefs = readFileSync(join(__dirname, './graphql/schema.graphql'), { encoding: 'utf-8' })

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

  async onReady(context: IMidwayContainer) {
    // const schema = await buildSchema({
    //   resolvers: [ReservationResolver],
    // })
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: context,
    })
    await apolloServer.start()
    // add middleware
    this.app.use(apolloServer.getMiddleware())
    this.app.useMiddleware([ReportMiddleware])
    this.app.useFilter([DefaultErrorFilter, NotFoundFilter])
    // this.app.use(await this.app.generateMiddleware('graphql:GraphQLKoaMiddleware'))
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
