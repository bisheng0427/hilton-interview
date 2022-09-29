import { httpError } from '@midwayjs/core'
import { Controller, Inject, Post, Body, Config, Get } from '@midwayjs/decorator'
import { JwtService } from '@midwayjs/jwt'
import { Context } from '@midwayjs/koa'
import { GetResult, UserNotFoundError } from 'couchbase'

import { EmployeeService } from '../service/employee.service'

@Controller('/auth')
export class AuthController {
  @Config('keys')
  keys

  @Inject()
  employeeService: EmployeeService

  @Inject()
  jwtService: JwtService

  @Inject()
  ctx: Context

  @Post('/employee')
  async employeeSignIn(@Body('email') email: string, @Body('password') password: string) {
    let getResult: GetResult

    try {
      getResult = await this.employeeService.findByEmail(email)
    } catch (error) {
      throw new UserNotFoundError()
    }

    if (getResult.content.password === password) {
      const token = this.jwtService.signSync({ email })
      this.ctx.cookies.set('Authorization', `Bearer ${token}`)
      console.log('token', token)
      return { success: true }
    } else {
      return { success: false, message: 'email/password uncorrect' }
    }
  }

  @Get('/check')
  async check() {
    if (!this.ctx.headers['authorization']) {
      throw new httpError.UnauthorizedError()
    }
    // 从 header 上获取校验信息
    const parts = this.ctx.get('authorization').trim().split(' ')

    if (parts.length !== 2) {
      throw new httpError.UnauthorizedError()
    }

    const [scheme, token] = parts

    if (/^Bearer$/i.test(scheme)) {
      try {
        //jwt.verify方法验证token是否有效
        await this.jwtService.verify(token, {
          complete: true,
        })
        return { success: true }
      } catch (error) {
        throw new httpError.UnauthorizedError()
      }
    }
  }
}
