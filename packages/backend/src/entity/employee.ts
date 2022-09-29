import { Expose } from 'class-transformer'

export class EmployeeEntity {
  @Expose()
  username: string

  @Expose()
  email: string

  password: string

  @Expose()
  ctime: string

  @Expose()
  mtime: string
}
