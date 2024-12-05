import * as http from 'http';
import * as bodyParser from 'body-parser';
import {INestApplication} from "../common/interfaces/nest-application.interface";
import {Logger} from "../common/services/logger.service";
import {NestContainer} from "./injector/container";
import {ApplicationConfig} from "./application-config";
import {ExpressAdapter} from "./adapters/express-adapter";
import {RoutesResolver} from "./router/routes-resolver";
import {Resolver} from "./router/interfaces/resolver.interface";
import {validatePath} from "../common/shared.utils";

// import iterate from 'iterare';
// import * as optional from 'optional';
// import {MiddlewaresModule} from "./middlewares/middlewares-module";
// import {MiddlewaresContainer} from "./middlewares/container";
// import {ApplicationConfig} from "./application-config";
// import {NestContainer} from "./injector/container";
// import {ExpressAdapter} from "./adapters/express-adapter";
// import {messages} from "./constants";
// import {isNil, isUndefined, validatePath} from "../common/utils/shared.utils";
// import {CanActivate} from "../common/interfaces/can-activate.interface";
// import {NestInterceptor} from "../common/interfaces/nest-interceptor.interface";
// import {PipeTransform} from "../common/interfaces/pipe-transform.interface";
// import {ExceptionFilter} from "../common/exceptions/exception-filter.interface";
// import {WebSocketAdapter} from "../common/interfaces/web-socket-adapter.interface";
// import {Module} from "./injector/module";
// import {OnModuleInit} from "../common/interfaces/modules/on-init.interface";
// import {OnModuleDestroy} from "../common/interfaces/modules/on-destroy.interface";

export class NestApplication implements INestApplication {
    private readonly logger = new Logger(NestApplication.name, true);
    private readonly config: ApplicationConfig;
    private isInitialized = false;
    private readonly routesResolver: Resolver = null;

    // private readonly middlewaresModule = new MiddlewaresModule();
    // private readonly middlewaresContainer = new MiddlewaresContainer();
    // private readonly microservicesModule = MicroservicesModule
    //   ? new MicroservicesModule()
    //   : null;
    // private readonly socketModule = SocketModule
    //   ? new SocketModule()
    //   : null;
    //
    private readonly httpServer: http.Server = null;


    // private readonly microservices = [];


    constructor(
        private readonly container: NestContainer,
        private readonly express,
    ) {
        this.setupParserMiddlewares();
        this.httpServer = http.createServer(express);

        // const ioAdapter = IoAdapter ? new IoAdapter(this.httpServer) : null;
        //this.config = new ApplicationConfig(ioAdapter);
        this.config = new ApplicationConfig();

        this.routesResolver = new RoutesResolver(
            container, ExpressAdapter, this.config,
        );
    }

    public setupParserMiddlewares() {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));
    }

    public async listen(port: number, callback?: () => void);
    public async listen(port: number, hostname: string, callback?: () => void);
    public async listen(port: number, ...args) {
        (!this.isInitialized) && await this.init();

        this.httpServer.listen(port, ...args);
        return this.httpServer;
    }

    public async init() {
        await this.setupModules();
        await this.setupRouter();
        //
        // this.callInitHook();
        this.logger.log(`Nest application successfully started`);
        this.isInitialized = true;
    }

    public async setupModules() {
        // 소켓
        // this.socketModule && this.socketModule.setup(this.container, this.config);
        // 마이크로서비스
        // if (this.microservicesModule) {
        //   this.microservicesModule.setup(this.container, this.config);
        //   this.microservicesModule.setupClients(this.container);
        // }
        // 미들웨어
        // await this.middlewaresModule.setup(
        //   this.middlewaresContainer,
        //   this.container,
        //   this.config,
        // );
    }

    public async setupRouter() {
        const router = ExpressAdapter.createRouter();
        // await this.setupMiddlewares(router); // 미들웨어로 보여서 일단 주석 처리

        this.routesResolver.resolve(router);
        this.express.use(validatePath(this.config.getGlobalPrefix()), router);
    }

    public use(requestHandler) {
        this.express.use(requestHandler);
    }


    //
    // public listenAsync(port: number, hostname?: string): Promise<any> {
    //     return new Promise((resolve) => {
    //         const server = this.listen(port, hostname, () => resolve(server));
    //     });
    // }
    //
    // public close() {
    //     this.socketModule && this.socketModule.close();
    //     this.httpServer && this.httpServer.close();
    //     this.microservices.forEach((microservice) => {
    //         microservice.setIsTerminated(true);
    //         microservice.close();
    //     });
    //     this.callDestroyHook();
    // }
    //
    // public setGlobalPrefix(prefix: string) {
    //     this.config.setGlobalPrefix(prefix);
    // }
    //
    // public useWebSocketAdapter(adapter: WebSocketAdapter) {
    //     this.config.setIoAdapter(adapter);
    // }
    //
    // public useGlobalFilters(...filters: ExceptionFilter[]) {
    //     this.config.useGlobalFilters(...filters);
    // }
    //
    // public useGlobalPipes(...pipes: PipeTransform<any>[]) {
    //     this.config.useGlobalPipes(...pipes);
    // }
    //
    // public useGlobalInterceptors(...interceptors: NestInterceptor[]) {
    //     this.config.useGlobalInterceptors(...interceptors);
    // }
    //
    // public useGlobalGuards(...guards: CanActivate[]) {
    //     this.config.useGlobalGuards(...guards);
    // }
    //
    // private async setupMiddlewares(instance) {
    //     await this.middlewaresModule.setupMiddlewares(this.middlewaresContainer, instance);
    // }
    //
    //
    // private callInitHook() {
    //     const modules = this.container.getModules();
    //     modules.forEach((module) => {
    //         this.callModuleInitHook(module);
    //     });
    // }
    //
    // private callModuleInitHook(module: Module) {
    //     const components = [...module.routes, ...module.components];
    //     iterate(components).map(([key, {instance}]) => instance)
    //         .filter((instance) => !isNil(instance))
    //         .filter(this.hasOnModuleInitHook)
    //         .forEach((instance) => (instance as OnModuleInit).onModuleInit());
    //     }
    //
    // private hasOnModuleInitHook(instance): instance is OnModuleInit {
    //     return !isUndefined((instance as OnModuleInit).onModuleInit);
    // }
    //
    // private callDestroyHook() {
    //     const modules = this.container.getModules();
    //     modules.forEach((module) => {
    //         this.callModuleDestroyHook(module);
    //     });
    // }
    //
    // private callModuleDestroyHook(module: Module) {
    //     const components = [...module.routes, ...module.components];
    //     iterate(components).map(([key, {instance}]) => instance)
    //             .filter((instance) => !isNil(instance))
    //             .filter(this.hasOnModuleDestroyHook)
    //             .forEach((instance) => (instance as OnModuleDestroy).onModuleDestroy());
    // }
    //
    // private hasOnModuleDestroyHook(instance): instance is OnModuleDestroy {
    //     return !isUndefined((instance as OnModuleDestroy).onModuleDestroy);
    // }
}