// import { WebSocketAdapter } from './web-socket-adapter.interface';
// import { CanActivate } from './can-activate.interface';
// import { NestInterceptor } from './nest-interceptor.interface';
// import {PipeTransform} from "./pipe-transform.interface";
// import {ExceptionFilter} from "../exceptions/exception-filter.interface";

export interface INestApplication {

    init(): Promise<void>;
    //use(requestHandler: any): void;
    listen(port: number, callback?: () => void): Promise<any>;
    //listen(port: number, hostname: string, callback?: () => void): Promise<any>;
    //listenAsync(port: number, hostname?: string): Promise<any>;
    //setGlobalPrefix(prefix: string): void;
    // useWebSocketAdapter(adapter: WebSocketAdapter): void;
    // useGlobalFilters(...filters: ExceptionFilter[]);
    // useGlobalPipes(...pipes: PipeTransform<any>[]);
    // useGlobalInterceptors(...interceptors: NestInterceptor[]);
    // useGlobalGuards(...guards: CanActivate[]);
    //close(): void;
}