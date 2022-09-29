import { Inject, Controller, Post, Get, Body, ALL, Param } from '@midwayjs/decorator'
import { ApiBearerAuth } from '@midwayjs/swagger'
import * as moment from 'moment'

import { ReservationEntity } from '../entity/reservation'
// import { PermitMiddleware } from '../middleware/permit.middleware'
import ReservationService from '../service/reservation.service'

@ApiBearerAuth()
@Controller('/employee')
export default class EmployeeReservation {
  @Inject()
  reservationService: ReservationService

  @Get('/reservation/:id', { summary: 'get reservation detail by id' })
  async getDetail(@Param('id') id: string) {
    const res = await this.reservationService.getDetail(id)
    return {
      success: true,
      data: res,
    }
  }

  @Get('/reservation/list', { summary: 'get reservation list' })
  async getList(@Param('date') date: string, @Param('status') status: string) {
    return await this.reservationService.getList(date, status)
  }

  @Post('/reservation/update', { summary: 'update reservation' })
  async updateField(@Body(ALL) body: ReservationEntity) {
    const reservation = { ...body }
    reservation.mtime = moment().toISOString()

    return await this.reservationService.create(reservation)
  }

  @Post('/reservation/cancel', { summary: 'cancel reservation' })
  async cancel(@Body(ALL) body: ReservationEntity) {
    const reservation = { ...body }
    reservation.mtime = moment().toISOString()

    return await this.reservationService.create(reservation)
  }
}
