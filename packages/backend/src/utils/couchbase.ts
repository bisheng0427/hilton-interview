import { Config, Init, Inject, Logger, Provide, Scope, ScopeEnum } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import { ILogger } from '@midwayjs/logger'
import { Bucket, Cluster, connect } from 'couchbase'

@Provide()
@Scope(ScopeEnum.Singleton)
export default class CouchbaseManager {
  @Config('couchbase')
  dbConfig

  @Inject()
  ctx: Context

  @Logger()
  logger: ILogger

  protected cluster: Cluster

  protected bucket: Bucket

  @Init()
  async init() {
    this.logger.info('[init couchbase] CONNECTING')
    try {
      this.cluster = await connect(this.dbConfig.host, {
        username: this.dbConfig.username,
        password: this.dbConfig.password,
        timeouts: {
          kvTimeout: 10000, // milliseconds
        },
      })
      this.bucket = this.cluster.bucket(this.dbConfig.bucket)
    } catch (error) {
      this.logger.error('[init couchbase] FAILED, ', error)
    }

    this.logger.info('[init couchbase] SUCCESS')
  }

  getCollection(_colName: string) {
    const collection = this.bucket.collection(_colName)
    return collection
  }

  getCluster() {
    return this.cluster
  }
}
