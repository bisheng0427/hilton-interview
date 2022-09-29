import { Provide, Inject, Init } from '@midwayjs/decorator'
import { Cluster, Collection } from 'couchbase'
import * as uuid from 'uuid'

import CouchbaseManager from '../utils/couchbase'

@Provide()
export class EmployeeService {
  protected collection: Collection
  protected cluster: Cluster

  @Inject()
  private dbManager: CouchbaseManager

  @Init()
  protected async init() {
    this.collection = await this.dbManager.getCollection('employee')
    this.cluster = this.dbManager.getCluster()
  }

  async addTestData() {
    const guest = {
      username: 'testbb',
      email: 'bb@test.com',
      password: '123',
    }

    // Create and store a document
    const res = await this.collection.upsert(uuid.v4(), guest)
    return res
  }

  async findByEmail(_email: string) {
    return this.collection.get(_email)
  }
}
