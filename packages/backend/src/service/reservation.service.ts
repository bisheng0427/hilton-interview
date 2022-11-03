import { Provide, Inject, Init } from '@midwayjs/decorator'
import { Cluster, Collection, MutateInSpec } from 'couchbase'
import * as moment from 'moment'
import * as uuid from 'uuid'

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

  async getList(_params: { startDate?: string; endDate?: string; status?: string; guestId?: string; page: number; take: number }) {
    const { startDate, endDate, status, guestId, page, take } = _params
    let query = `
      SELECT META(r).id as id, g.firstName, g.lastName, g.mobile, r.arrivalTime, r.guestId, r.tableSize, r.status, r.ctime
      FROM \`resturant\`._default.reservation as r
      JOIN \`resturant\`._default.guest as g ON KEYS r.guestId
      WHERE 1=1 
    `
    if (status && status !== '') {
      query += ` AND r.status="${status}"`
    }
    if (guestId) {
      query += ` AND r.guestId="${guestId}"`
    }
    if (startDate && startDate !== '') {
      query += ` AND r.arrivalTime>="${startDate}"`
    }
    if (endDate && endDate !== '') {
      query += ` AND r.arrivalTime<="${endDate}"`
    }

    query += ` ORDER BY r.arrivalTime desc`

    query += ` OFFSET ${(page - 1) * take} LIMIT ${take}`

    const res = await this.cluster.query(query)
    return res.rows
  }

  async create(_reservation: ReservationEntity) {
    const id = uuid.v4()
    _reservation.status = RESERVATION_STATUS.TO_BE_COMFIRMED
    await this.reservation.insert(
      id,
      {
        ..._reservation,
        ctime: moment().toISOString(),
        mtime: moment().toISOString(),
      },
      { timeout: 5000 }
    )
    return { ..._reservation, id }
  }

  async updateField(_reservation: ReservationEntity) {
    console.log('_reservation', _reservation)
    const { arrivalTime, tableSize, status } = _reservation

    const mutations = [MutateInSpec.upsert('mtime', moment().toISOString())]
    if (arrivalTime) mutations.push(MutateInSpec.upsert('arrivalTime', _reservation.arrivalTime))
    if (tableSize) mutations.push(MutateInSpec.upsert('tableSize', _reservation.tableSize))
    if (status) mutations.push(MutateInSpec.upsert('status', _reservation.status))

    await this.reservation.mutateIn(_reservation.id, mutations)
    return { ..._reservation }
  }

  async cancel(_reservation: ReservationEntity) {
    const res = await this.reservation.mutateIn(_reservation.id, [MutateInSpec.upsert('status', RESERVATION_STATUS.CANCELED), MutateInSpec.upsert('mtime', moment().toISOString())])
    return res
  }
}
