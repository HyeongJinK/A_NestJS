// 간단한 Nest.js 프레임워크 만들기

// 1. 패키지 설치
// 프로젝트 디렉토리를 만들고 초기화한 후 다음 패키지를 설치합니다.
// npm init -y
// npm install express reflect-metadata jest supertest
// npm i --save-dev @types/express @types/jest

// 2. 간단한 서버 설정
import 'reflect-metadata';
import express, { Request, Response, Router, Express } from 'express';

// @Controller 데코레이터 정의: 특정 경로에 대한 컨트롤러를 등록하는 데 사용됩니다.
function Controller(basePath: string): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata('basePath', basePath, target);
    };
}

// @Get, @Post 데코레이터 정의: 특정 경로에 대한 HTTP GET 또는 POST 요청을 처리하는 메서드를 등록합니다.
function Get(path: string): MethodDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata('method', 'get', target, propertyKey);
        Reflect.defineMetadata('path', path, target, propertyKey);
    };
}

function Post(path: string): MethodDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata('method', 'post', target, propertyKey);
        Reflect.defineMetadata('path', path, target, propertyKey);
    };
}

// @HttpCode 데코레이터 정의: 응답 상태 코드를 설정하는 데 사용됩니다.
function HttpCode(statusCode: number): MethodDecorator {
    return (target, propertyKey) => {
        Reflect.defineMetadata('httpCode', statusCode, target, propertyKey);
    };
}

// @Header 데코레이터 정의: 응답 헤더를 설정하는 데 사용됩니다.
function Header(headerName: string, headerValue: string): MethodDecorator {
    return (target, propertyKey) => {
        const existingHeaders = Reflect.getMetadata('headers', target, propertyKey) || [];
        existingHeaders.push({ headerName, headerValue });
        Reflect.defineMetadata('headers', existingHeaders, target, propertyKey);
    };
}

// @Query 데코레이터 정의: 요청 쿼리 파라미터를 메서드의 매개변수로 주입하는 데 사용됩니다.
function Query(name: string): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
        const existingQueries = Reflect.getMetadata('queries', target, propertyKey) || [];
        existingQueries.push({ name, parameterIndex });
        Reflect.defineMetadata('queries', existingQueries, target, propertyKey);
    };
}

// @Param 데코레이터 정의: URL 경로 파라미터를 메서드의 매개변수로 주입하는 데 사용됩니다.
function Param(name: string): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
        const existingParams = Reflect.getMetadata('params', target, propertyKey) || [];
        existingParams.push({ name, parameterIndex });
        Reflect.defineMetadata('params', existingParams, target, propertyKey);
    };
}

// @Body 데코레이터 정의: 요청 본문(body)을 메서드의 매개변수로 주입하는 데 사용됩니다.
function Body(target: any, propertyKey: string | symbol, parameterIndex: number): void {
    const existingBodies = Reflect.getMetadata('bodies', target, propertyKey) || [];
    existingBodies.push({ parameterIndex });
    Reflect.defineMetadata('bodies', existingBodies, target, propertyKey);
}

// @Service 데코레이터 정의: 서비스 클래스를 등록하는 데 사용됩니다.
function Service(): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata('service', true, target);
    };
}

// @Module 데코레이터 정의: 서비스와 컨트롤러를 모듈로 등록하는 데 사용됩니다.
function Module(services: any[], controllers: any[]): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata('services', services, target);
        Reflect.defineMetadata('controllers', controllers, target);
    };
}

// 3. 서비스 정의
@Service()
class AppService {
    // Hello 메시지를 반환하는 메서드
    getHello(): string {
        return 'Hello, World!';
    }
}

@Service()
class BoardService {
    // 게시판 목록을 반환하는 메서드
    getBoards(): string {
        return 'Board list';
    }
}

// DTO 정의
class CreateBoardDto {
    title: string;
    description: string;
}

// 4. 컨트롤러 정의
@Controller('/')
class AppController {
    private appService: AppService;

    // AppService를 주입받아 초기화
    constructor(appService: AppService) {
        this.appService = appService;
    }

    // 루트 경로에 대한 GET 요청을 처리하는 메서드
    @Get('/')
    getHello(@Query('name') name: string): string {
        return this.appService.getHello();
    }

    // /test 경로에 대한 GET 요청을 처리하는 메서드
    @Get('/test')
    @HttpCode(204)
    getTest(): void {
        return;
    }
}

@Controller('/boards')
class BoardController {
    private boardService: BoardService;

    // BoardService를 주입받아 초기화
    constructor(boardService: BoardService) {
        this.boardService = boardService;
    }

    // /boards 경로에 대한 GET 요청을 처리하는 메서드
    @Get('/')
    getBoards(): string {
        return this.boardService.getBoards();
    }

    // /boards/detail 경로에 대한 GET 요청을 처리하는 메서드 (쿼리 사용 예시)
    @Get('/detail')
    getBoardDetail(@Query('id') id: string): string {
        return `Detail of board with id: ${id}`;
    }

    // /boards/:id 경로에 대한 GET 요청을 처리하는 메서드 (URL 파라미터 사용 예시)
    @Get('/:id')
    getBoardById(@Param('id') id: string): string {
        return `Board with id: ${id}`;
    }

    // /boards 경로에 대한 POST 요청을 처리하는 메서드 (Body 사용 예시)
    @Post('/')
    createBoard(@Body body: CreateBoardDto): string {
        return `Board created with title: ${body.title} and description: ${body.description}`;
    }
}

// 5. 모듈 정의
@Module([AppService], [AppController])
class AppModule {}

@Module([BoardService], [BoardController])
class BoardModule {}

@Module([], [AppModule, BoardModule])
class RootModule {
    public appModule: AppModule;
    public boardModule: BoardModule;

    // AppModule과 BoardModule을 초기화
    constructor() {
        this.appModule = new AppModule();
        this.boardModule = new BoardModule();
    }
}

// Application 클래스 정의
class Application {
    private app: Express;

    constructor() {
        this.app = express();
    }

    bootstrap(modules: any[]): void {
        this.app.use(express.json());
        const router = Router();
        modules.forEach((module) => {
            const controllerInstances = createInstance<any>(module);

            controllerInstances.forEach((instance: any) => {
                const controllerClass = instance.constructor;
                const basePath = Reflect.getMetadata('basePath', controllerClass).replace(/\/+/g, '/');
                const controllerPrototype = Object.getPrototypeOf(instance);

                Object.getOwnPropertyNames(controllerPrototype).forEach((key) => {
                    if (key === 'constructor') return;

                    const method: 'get' | 'post' = Reflect.getMetadata('method', controllerPrototype, key);
                    const path = Reflect.getMetadata('path', controllerPrototype, key).replace(/\/+/g, '/');
                    const statusCode = Reflect.getMetadata('httpCode', controllerPrototype, key);
                    const headers = Reflect.getMetadata('headers', controllerPrototype, key) || [];
                    const queries = Reflect.getMetadata('queries', controllerPrototype, key) || [];
                    const params = Reflect.getMetadata('params', controllerPrototype, key) || [];
                    const bodies = Reflect.getMetadata('bodies', controllerPrototype, key) || [];

                    if (method && path) {
                        const fullPath = `${basePath}${path}`.replace(/\/+/g, '/');
                        (router as any)[method](fullPath, (req: Request, res: Response) => {
                            headers.forEach(({ headerName, headerValue }: { headerName: string; headerValue: string }) => {
                                res.setHeader(headerName, headerValue);
                            });
                            if (statusCode) {
                                res.status(statusCode);
                            }

                            const args = [];
                            params.forEach(({ name, parameterIndex }: { name: string; parameterIndex: number }) => {
                                args[parameterIndex] = req.params[name];
                            });
                            queries.forEach(({ name, parameterIndex }: { name: string; parameterIndex: number }) => {
                                args[parameterIndex] = req.query[name];
                            });
                            bodies.forEach(({ parameterIndex }: { parameterIndex: number }) => {
                                args[parameterIndex] = req.body;
                            });

                            const result = instance[key](...args);
                            if (result !== undefined) {
                                res.send(result);
                            }
                        });
                    }
                });
            });
        });
        this.app.use(router);
    }

    listen(port: number, callback?: () => void): void {
        this.app.listen(port, callback);
    }
}

// 7. 서버 설정 및 시작
const rootModule = new RootModule();
const app = new Application();
app.bootstrap([AppModule, BoardModule]);
app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});

// 모듈의 서비스와 컨트롤러 인스턴스를 생성하는 함수
function createInstance<T>(target: any): T[] {
    const services = Reflect.getMetadata('services', target) || [];
    const controllers = Reflect.getMetadata('controllers', target) || [];

    // 서비스 인스턴스 생성
    const serviceInstances = services.reduce((instances, service) => {
        instances[service.name] = new service();
        return instances;
    }, {} as Record<string, any>);

    // 컨트롤러 인스턴스 생성 및 의존성 주입
    const controllerInstances = controllers.reduce((instances, controller) => {
        const paramTypes = Reflect.getMetadata('design:paramtypes', controller) || [];
        const dependencies = paramTypes.map((param: any) => serviceInstances[param.name]);
        instances.push(new controller(...dependencies));
        return instances;
    }, [] as any[]);

    return [...Object.values(serviceInstances), ...controllerInstances] as T[];
}
