import { Provide, Inject, Init } from '@midwayjs/decorator'
import { Cluster, Collection, MutateInSpec } from 'couchbase'
import * as moment from 'moment'

import { ReservationEntity, RESERVATION_STATUS } from '../entity/reservation'
import CouchbaseManager from '../utils/couchbase'

@Provide()
export default class ReservationService {
  protected reservation: Collection
  protected cluster: Cluster

  @Inject()
  private dbManager: CouchbaseManager

  @Init()
  protected async init() {
    this.reservation = await this.dbManager.getCollection('reservation')
    this.cluster = this.dbManager.getCluster()
  }

  async getDetail(_id: string) {
    const query = `
      SELECT META(r).id as id, g.firstName, g.lastName, g.mobile, r.arrivalTime, r.tableSize, r.status 
      FROM \`resturant\`._default.reservation as r
      JOIN \`resturant\`._default.guest as g ON KEYS r.guestId
      WHERE META(r).id='${_id}'
    `
    const res = await this.cluster.query(query)
    return res.rows[0]
  }

  async getList(_date: string, _status: string) {
    let query = `
      SELECT g.firstName, g.lastName, g.mobile, r.arrivalTime, r.tableSize, r.status 
      FROM \`resturant\`._default.reservation as r
      JOIN \`resturant\`._default.guest as g ON KEYS r.guestId
      WHERE 1=1 
    `
    if (_date && _date !== '') {
      query += ` AND date=${moment(_date).format('YYYY-MM-DD')}'`
    }
    if (_status && _status !== '') {
      query += ` AND status=${_status}'`
    }
    const res = await this.cluster.query(query)
    return res.rows
  }

  async create(_reservation: ReservationEntity) {
    console.log('_reservation', _reservation)
    const res = await this.reservation.insert(_reservation.id, _reservation, { timeout: 5000 })
    return res
  }

  async updateField(_reservation: ReservationEntity) {
    const res = await this.reservation.mutateIn(_reservation.id, [
      MutateInSpec.upsert('arrivalTime', _reservation.arrivalTime),
      MutateInSpec.upsert('tableSize', _reservation.tableSize),
      MutateInSpec.upsert('mtime', moment().toISOString()),
    ])
    return res
  }

  async cancel(_reservation: ReservationEntity) {
    const res = await this.reservation.mutateIn(_reservation.id, [MutateInSpec.upsert('status', RESERVATION_STATUS.CANCELED), MutateInSpec.upsert('mtime', moment().toISOString())])
    return res
  }
}
