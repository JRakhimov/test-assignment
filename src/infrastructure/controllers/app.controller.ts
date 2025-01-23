import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  create(): { status: boolean } {
    return { status: true };
  }
}
