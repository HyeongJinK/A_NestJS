import { Application } from 'express';
import {Resolver} from "./interfaces/resolver.interface";
import {Logger} from "../../common/services/logger.service";
import {InstanceWrapper, NestContainer} from "../injector/container";
import {ApplicationConfig} from "../application-config";
import {RouterProxy} from "./router-proxy";
import {MetadataScanner} from "../metadata-scanner";
import {ExpressRouterExplorer} from "./router-explorer";
import {Controller} from "../../common/interfaces/controllers/controller.interface";
import {Metatype} from "../../common/interfaces/metatype.interface";
import {PATH_METADATA} from "../../common/constants";
import {isUndefined} from "../../common/shared.utils";
import {UnknownRequestMappingException} from "../errors/exceptions/unknown-request-mapping.exception";

export class RoutesResolver implements Resolver {
    private readonly logger = new Logger(RoutesResolver.name, true);
    private readonly routerProxy = new RouterProxy();
    private readonly routerBuilder: ExpressRouterExplorer;

    constructor(
        private readonly container: NestContainer,
        private readonly expressAdapter,
        private readonly config: ApplicationConfig) {

        this.routerBuilder = new ExpressRouterExplorer(
            new MetadataScanner()
            , this.routerProxy
            , expressAdapter
            , config
            , this.container,
        );
    }

    public resolve(express: Application) {
        // 모델을 가져옴
        const modules = this.container.getModules();
        // 가져온 모듈에서 routes(Controller)를 가져와서 setupRouters() 호출
        modules.forEach(({ routes }, moduleName) => this.setupRouters(routes, moduleName, express));
    }

    public setupRouters(
        routes: Map<string, InstanceWrapper<Controller>>,
        moduleName: string,
        express: Application) {
        this.logger.log(`setupRouters() ${moduleName}`);

        // routes(Controller) 반복문
        // 인스턴스와 메타타입, 인스턴스의 경우 함수를 실행하기 위해서 필요
        routes.forEach(({ instance, metatype }) => {
            // 메타데이터에서 path 가져오기
            const path = this.fetchRouterPath(metatype);  // 메타데이터에서 path 가져오기
            this.logger.log(`setupRouters() ${metatype.name} {${path}}:`)

            // 라우터 생성
            const router = this.routerBuilder.explore(instance, metatype, moduleName);
            // express에 라우터 등록
            express.use(path, router);
        });
    }

    public fetchRouterPath(metatype: Metatype<Controller>): string {
        const path = Reflect.getMetadata(PATH_METADATA, metatype);
        return this.validateRoutePath(path);
    }

    public validateRoutePath(path: string): string {
        if (isUndefined(path)) {
            throw new UnknownRequestMappingException();
        }
        return (path.charAt(0) !== '/') ? '/' + path: path; // 맨 앞에 /가 없으면 붙여주기
    }
}