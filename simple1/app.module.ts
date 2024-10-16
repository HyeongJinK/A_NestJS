import { AppController } from './app.controller';
import { container } from './di-container';

// 모듈 초기화 및 의존성 주입
export class AppModule {
  constructor() {
    container.register(AppController, AppController);
  }
}
