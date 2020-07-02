import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getDefaultMessage(): string {
    return 'App works!';
  }
}
