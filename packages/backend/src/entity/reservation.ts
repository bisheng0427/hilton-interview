import { ApiProperty } from '@midwayjs/swagger'

export enum RESERVATION_STATUS {
  'CANCELED' = 'canceled',
  'COMPLETED' = 'completed',
  'TO_BE_COMFIRMED' = 'tbd',
}

export class ReservationEntity {
  @ApiProperty({
    description: 'id',
    required: false,
  })
  id: string

  @ApiProperty({
    description: 'guest id',
    required: true,
  })
  guestId: string

  @ApiProperty({
    description: 'arrival time',
    required: true,
  })
  arrivalTime: Date

  @ApiProperty({
    description: 'table size',
    required: true,
  })
  tableSize: number

  @ApiProperty({
    description: 'status',
    required: true,
  })
  status: RESERVATION_STATUS

  @ApiProperty({
    description: 'create time',
    required: true,
  })
  ctime: string

  @ApiProperty({
    description: 'modify time',
    required: true,
  })
  mtime: string
}
