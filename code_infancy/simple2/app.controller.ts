import { Controller, Get, Param } from './decorators';

@Controller('/hello')
export class AppController {
  @Get('/:name') // 경로 변수 사용
  getHello(@Param('name') name: string): string {
    return `Hello, ${name}!`;
  }

  @Get('/') // 파라미터 없는 경우
  getGeneralHello(): string {
    return 'Hello, World!';
  }
}