import { Expose } from 'class-transformer'

export class GuestEntity {
  @Expose()
  id: string

  @Expose()
  firstName: string

  @Expose()
  lastName: string

  @Expose()
  loginId: string

  password: string

  @Expose()
  mobile: string

  @Expose()
  ctime: string

  @Expose()
  mtime: string
}
