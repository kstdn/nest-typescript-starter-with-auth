import { Controller, Get } from '@nestjs/common';
import { Routes } from './routes';

@Controller(Routes.Root)
export class AppController {
  @Get()
  getHello(): string {
    return 'App works!';
  }
}
