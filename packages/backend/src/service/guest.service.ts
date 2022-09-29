import { Provide, Inject, Init } from '@midwayjs/decorator'
import { Cluster, Collection } from 'couchbase'
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
    const guest = {
      type: 'user',
      name: 'Michael',
      email: 'michael123@test.com',
      interests: ['Swimming', 'Rowing'],
    }

    // Create and store a document
    const res = await this.collection.upsert(uuid.v4(), guest)
    return res
  }
}
