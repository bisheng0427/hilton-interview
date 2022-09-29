import { Provide, Inject, Config } from '@midwayjs/decorator'
import { IWebMiddleware, IMidwayKoaContext, NextFunction } from '@midwayjs/koa'
import { JwtService } from '@midwayjs/jwt'
import { httpError } from '@midwayjs/core'

@Provide()
export class PermitMiddleware implements IWebMiddleware {
  @Config('keys')
  keys

  @Inject()
  jwtService: JwtService

  resolve() {
    return async (ctx: IMidwayKoaContext, next: NextFunction) => {
      // 判断下有没有校验信息
      if (!ctx.headers['authorization']) {
        throw new httpError.UnauthorizedError()
      }
      // 从 header 上获取校验信息
      const parts = ctx.get('authorization').trim().split(' ')

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
        } catch (error) {
          throw new httpError.UnauthorizedError()
        }
        await next()
      }
    }
  }
}
