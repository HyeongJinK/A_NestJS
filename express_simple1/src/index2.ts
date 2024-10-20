// 간단한 Nest.js 프레임워크 만들기

// 1. 패키지 설치
// 프로젝트 디렉토리를 만들고 초기화한 후 다음 패키지를 설치합니다.
// npm init -y
// npm install express reflect-metadata inversify
// npm i --save-dev @types/express

// 2. 간단한 서버 설정
import 'reflect-metadata';
import express, { Request, Response, Router } from 'express';
import { Container, injectable, inject } from 'inversify';

// 의존성 주입을 위한 식별자
const TYPES = {
    Controller: Symbol.for('Controller'),
    Service: Symbol.for('Service'),
};

// @Controller 데코레이터 정의
function Controller(basePath: string): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata('basePath', basePath, target);
    };
}

// 3. 서비스 정의
@injectable()
class AppService {
    getHello(): string {
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
    }

    getHello(req: Request, res: Response): void {
        res.send(this.appService.getHello());
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
    const basePath = Reflect.getMetadata('basePath', controller);
    router.get(basePath, (req: Request, res: Response) => instance.getHello(req, res));
});

app.use(router);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
