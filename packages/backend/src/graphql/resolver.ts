import { IMidwayContainer } from '@midwayjs/core'
import ReservationService from '../service/reservation.service'

export const resolvers = {
  Query: {
    reservation: async (_, args, context: IMidwayContainer) => {
      const reservationSrv = await context.getAsync(ReservationService)
      return await reservationSrv.getDetail(args.id)
    },
    reservations: async (_, args, context: IMidwayContainer) => {
      const { params } = args
      const reservationSrv = await context.getAsync(ReservationService)
      return await reservationSrv.getList(params)
    },
  },
  Mutation: {
    addReservation: async (_, args, context: IMidwayContainer) => {
      const reservationSrv = await context.getAsync(ReservationService)
      return await reservationSrv.create(args)
    },
    updateReservation: async (_, args, context: IMidwayContainer) => {
      const { reservation } = args
      console.log('reservation', reservation)
      const reservationSrv = await context.getAsync(ReservationService)
      return await reservationSrv.updateField(reservation)
    },
  },
}
