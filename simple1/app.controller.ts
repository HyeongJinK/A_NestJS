import { Controller, Get } from './decorators';

@Controller('/hello')
export class AppController {
    @Get('/')
    getHello(): string {
      return 'Hello World!';
    }
}
