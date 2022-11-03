import { Provide, Inject, Init } from '@midwayjs/decorator'
import { Cluster, Collection } from 'couchbase'
import moment = require('moment')
import * as uuid from 'uuid'

import CouchbaseManager from '../utils/couchbase'

@Provide()
export class GuestService {
  protected collection: Collection
  protected cluster: Cluster

  @Inject()
  private dbManager: CouchbaseManager

  @Init()
  protected async init() {
    this.collection = await this.dbManager.getCollection('guest')
    this.cluster = this.dbManager.getCluster()
  }

  async addTestData() {
    const guest1 = {
      firstName: 'Bi',
      lastName: 'Sheng01',
      loginId: '120114531@qq.com',
      password: '123',
      mobile: '12345',
      ctime: moment().toISOString(),
      mtime: moment().toISOString(),
    }
    const guest2 = {
      firstName: 'Bi',
      lastName: 'Sheng02',
      loginId: '120114532@qq.com',
      password: '123',
      mobile: '12345',
      ctime: moment().toISOString(),
      mtime: moment().toISOString(),
    }

    // Create and store a document
    await this.collection.upsert('120114531@qq.com', guest1)
    await this.collection.upsert('120114532@qq.com', guest2)
    return { success: true }
  }

  async findByEmail(_email: string) {
    return this.collection.get(_email)
  }
}
