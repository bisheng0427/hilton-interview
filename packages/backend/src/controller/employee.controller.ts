import { Inject, Controller, Post, Get, Body, ALL, Param } from '@midwayjs/decorator'
import { ApiBearerAuth } from '@midwayjs/swagger'
import * as moment from 'moment'

import { ReservationEntity } from '../entity/reservation'
import { EmployeeService } from '../service/employee.service'
// import { PermitMiddleware } from '../middleware/permit.middleware'
import ReservationService from '../service/reservation.service'

@ApiBearerAuth()
@Controller('/employee')
export default class EmployeeReservation {
  @Inject()
  reservationService: ReservationService

  @Inject()
  employeeSrv: EmployeeService

  @Get('/testData', { description: 'build test data' })
  async testData() {
    this.employeeSrv.addTestData()
  }

  @Get('/reservation/:id', { summary: 'get reservation detail by id' })
  async getDetail(@Param('id') id: string) {
    const res = await this.reservationService.getDetail(id)
    return {
      success: true,
      data: res,
    }
  }

  @Get('/reservation/list', { summary: 'get reservation list' })
  async getList(@Param('page') page: number, @Param('take') take: number, @Param('status') status: string) {
    return await this.reservationService.getList({
      page,
      take,
      status,
    })
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
