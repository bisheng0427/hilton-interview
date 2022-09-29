import { Controller, Get } from '@midwayjs/decorator'

@Controller('/')
export class HomeController {
  @Get('/ping')
  async home(): Promise<string> {
    return 'Hello Midwayjs!'
  }
}
