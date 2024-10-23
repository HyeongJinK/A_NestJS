// index.ts
import 'reflect-metadata';
import { Application } from './app';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { container } from './container';

container.set(UserService, new UserService());

const app = new Application();
app.bootstrap([UserController]);

app.listen(3000, () => {
  console.log('서버가 http://localhost:3000 에서 실행 중입니다.');
});
