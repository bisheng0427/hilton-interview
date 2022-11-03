import { Inject, Controller, Post, Body, ALL, Get } from '@midwayjs/decorator'
import * as uuid from 'uuid'
import * as moment from 'moment'

import { ReservationEntity } from '../entity/reservation'
import ReservationService from '../service/reservation.service'
import { GuestService } from '../service/guest.service'

@Controller('/guest')
export class GuestController {
  @Inject()
  reservationService: ReservationService

  @Inject()
  guestService: GuestService

  @Get('/testData', { description: 'build test data' })
  async testData() {
    this.guestService.addTestData()
  }

  @Post('/reservation', { summary: 'create reservation' })
  async create(@Body(ALL) body: ReservationEntity) {
    const reservation = { ...body }
    reservation.id = uuid.v4()
    reservation.ctime = moment().toISOString()
    reservation.mtime = moment().toISOString()

    return await this.reservationService.create(reservation)
  }

  @Post('/reservation/update', { summary: 'update reservation' })
  async updateField(@Body(ALL) body: ReservationEntity) {
    const reservation = { ...body }
    reservation.mtime = moment().toISOString()

    return await this.reservationService.updateField(reservation)
  }

  @Post('/reservation/cancel', { summary: 'cancel reservation' })
  async cancel(@Body(ALL) body: ReservationEntity) {
    const reservation = { ...body }
    reservation.mtime = moment().toISOString()

    return await this.reservationService.create(reservation)
  }
}
