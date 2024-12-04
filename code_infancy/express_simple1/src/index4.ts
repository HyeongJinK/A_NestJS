// 간단한 Nest.js 프레임워크 만들기

// 1. 패키지 설치
// 프로젝트 디렉토리를 만들고 초기화한 후 다음 패키지를 설치합니다.
// npm init -y
// npm install express reflect-metadata inversify jest supertest
// npm i --save-dev @types/express @types/jest

// 2. 간단한 서버 설정
import 'reflect-metadata';
import express, { Request, Response, Router } from 'express';
import { Container, injectable, inject } from 'inversify';

// 의존성 주입을 위한 식별자
const TYPES = {
  Controller: Symbol.for('AppController'),
  Service: Symbol.for('Service'),
};

// @Controller 데코레이터 정의
function Controller(basePath: string): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata('basePath', basePath, target);
    console.log(`Controller registered with basePath: ${basePath}`);
  };
}

// @Get, @Post 데코레이터 정의
function Get(path: string): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata('method', 'get', target, propertyKey);
    Reflect.defineMetadata('path', path, target, propertyKey);
    console.log(`Get route registered: ${path} on ${propertyKey.toString()}`);
  };
}

function Post(path: string): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata('method', 'post', target, propertyKey);
    Reflect.defineMetadata('path', path, target, propertyKey);
    console.log(`Post route registered: ${path} on ${propertyKey.toString()}`);
  };
}

// 3. 서비스 정의
@injectable()
class AppService {
  getHello(): string {
    console.log('AppService: getHello called');
    return 'Hello, World!';
  }
}

// 4. 컨트롤러 정의
@Controller('/')
@injectable()
class AppController {
  private appService: AppService;

  constructor(@inject(TYPES.Service) appService: AppService) {
    this.appService = appService;
    console.log('AppController instantiated');
  }

  @Get('/')
  getHello(req: Request, res: Response): void {
    console.log('AppController: getHello called');
    res.send(this.appService.getHello());
  }

  @Get('/test')
  getTest(req: Request, res: Response): void {
    console.log('AppController: getTest called');
    res.send('Test');
  }
}

// 5. 서버 설정 및 시작
const container = new Container({ defaultScope: 'Singleton' });
container.bind<AppService>(TYPES.Service).to(AppService);
container.bind<AppController>(TYPES.Controller).to(AppController);

const app = express();
const port = 3000;

// 컨트롤러 등록 및 라우터 설정
const router = Router();
const controllers = [AppController];

controllers.forEach((controller) => {
  const instance = container.get<any>(TYPES.Controller);
  const basePath = Reflect.getMetadata('basePath', controller).replace(/\/+/g, '/');
  console.log(`Setting up routes for controller with basePath: ${basePath}`);
  const controllerPrototype = Object.getPrototypeOf(instance);

  Object.getOwnPropertyNames(controllerPrototype).forEach((key) => {
    if (key === 'constructor') return;

    const method: 'get' | 'post' = Reflect.getMetadata('method', controllerPrototype, key);
    const path = Reflect.getMetadata('path', controllerPrototype, key).replace(/\/+/g, '/');

    if (method && path) {
      const fullPath = `${basePath}${path}`.replace(/\/+/g, '/');
      console.log(`Registering route: [${method.toUpperCase()}] ${fullPath}`);
      (router as any)[method](fullPath, (req: Request, res: Response) => {
        console.log(`Handling request: [${method.toUpperCase()}] ${fullPath}`);
        instance[key](req, res);
      });
    }
  });
});

app.use(router);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

export default app;