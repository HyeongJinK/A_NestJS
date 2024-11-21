import 'reflect-metadata';
import {RouterExplorer} from "./interfaces/explorer.inteface";
import {Logger} from "../../common/services/logger.service";
import {MetadataScanner} from "../metadata-scanner";
import {RouterProxy, RouterProxyCallback} from "./router-proxy";
import {ExpressAdapter} from "../adapters/express-adapter";
import {ApplicationConfig} from "../application-config";
import {NestContainer} from "../injector/container";
import {RouterExecutionContext} from "./router-execution-context";
import {RouteParamsFactory} from "./route-params-factory";
import {RequestMethod} from "../../common/enums/request-method.enum";
import {Controller} from "../../common/interfaces/controllers/controller.interface";
import {Metatype} from "../../common/interfaces/metatype.interface";
import {METHOD_METADATA, PATH_METADATA} from "../../common/constants";
import {isUndefined, validatePath} from "../../common/shared.utils";
import {UnknownRequestMappingException} from "../errors/exceptions/unknown-request-mapping.exception";
import {InterceptorsConsumer} from "../interceptors/interceptors-consumer";
import {InterceptorsContextCreator} from "../interceptors/interceptors-context-creator";

export class ExpressRouterExplorer implements RouterExplorer {
    private readonly executionContextCreator: RouterExecutionContext;
    private readonly routerMethodFactory = new RouterMethodFactory();
    private readonly logger = new Logger('RouterExplorer', true);

    constructor(
        private readonly metadataScanner?: MetadataScanner,
        private readonly routerProxy?: RouterProxy,
        private readonly expressAdapter?: ExpressAdapter,
        private readonly config?: ApplicationConfig,
        container?: NestContainer) {

        this.executionContextCreator = new RouterExecutionContext(
            new RouteParamsFactory(),
            // 인터셉터
            new InterceptorsContextCreator(container, config),
            new InterceptorsConsumer(),
        );
    }

    public explore(instance: Controller, metatype: Metatype<Controller>, module: string) {
        this.logger.log(`explore() instance: ${instance} metatype: ${metatype} module: ${module}`);

        const router = (this.expressAdapter as any).createRouter();
        /**
         *  router: function router(req, res, next) {
         *     router.handle(req, res, next);
         *  }
         * */
        const instancePrototype = Object.getPrototypeOf(instance);
        // 아래 함수에서 생성자 및 매개변수를 제외하고 함수만 추출
        const routerPaths = this.metadataScanner.scanFromPrototype<Controller, RoutePathProperties>(
            instance,
            instancePrototype,
            (method) => this.exploreMethodMetadata(instance, instancePrototype, method),
        );

        this.logger.log(`explore() json.stringify(routerPaths): ${JSON.stringify(routerPaths)}`);
        /**
         * [{"path":"/test","requestMethod":"get","methodName":"test"}]
         [{
             path: this.validateRoutePath(routePath),        // test
             requestMethod,                                  // RequestMethod.GET
             targetCallback,                                 // test(id) { console.log('test') }
             methodName,                                     // test
         }];
         */

        (routerPaths || []).map((pathProperties) => {
            this.applyCallbackToRouter(router, pathProperties, instance, module);
        });
        return router;
    }

    private applyCallbackToRouter(
        router,
        pathProperties: RoutePathProperties,
        instance: Controller,
        module: string) {

        const { path, requestMethod, targetCallback, methodName } = pathProperties;

        const routerMethod = this.routerMethodFactory.get(router, requestMethod).bind(router);  // 메서드 가져오기

        // const proxy = this.createCallbackProxy(instance, targetCallback, methodName, module, requestMethod);
        const executionContext = this.executionContextCreator.create(instance, targetCallback, methodName, module, requestMethod);
        const proxy = this.routerProxy.createProxy(executionContext);

        this.logger.log(`applyCallbackToRouter() proxy: ${proxy}`);
        routerMethod(path, proxy);
    }

    public fetchRouterPath(metatype: Metatype<Controller>): string {
        const path = Reflect.getMetadata(PATH_METADATA, metatype);
        return this.validateRoutePath(path);
    }

    public validateRoutePath(path: string): string {
        if (isUndefined(path)) {
            throw new UnknownRequestMappingException();
        }
        return validatePath(path);
    }

    public exploreMethodMetadata(instance: Controller, instancePrototype, methodName: string): RoutePathProperties {
        const targetCallback = instancePrototype[methodName];
        const routePath = Reflect.getMetadata(PATH_METADATA, targetCallback);

        this.logger.log(`exploreMethodMetadata() instance: ${instance} instancePrototype: ${instancePrototype} methodName: ${methodName}
        targetCallback: ${targetCallback} 
        routePath: ${routePath}`);
        if (isUndefined(routePath)) {
            return null;
        }

        const requestMethod: RequestMethod = Reflect.getMetadata(METHOD_METADATA, targetCallback);
        this.logger.log(`exploreMethodMetadata() requestMethod: ${requestMethod}`);
        return {
            path: this.validateRoutePath(routePath),        // test
            requestMethod,                                  // RequestMethod.GET
            targetCallback,                                 // test(id) { console.log('test') }
            methodName,                                     // test
        };
    }
}

export interface RoutePathProperties {
    path: string;
    requestMethod: RequestMethod;
    targetCallback: RouterProxyCallback;
    methodName: string;
}

export class RouterMethodFactory {
    public get(target, requestMethod: RequestMethod) {
        switch (requestMethod) {
            case RequestMethod.POST: return target.post;
            case RequestMethod.ALL: return target.all;
            case RequestMethod.DELETE: return target.delete;
            case RequestMethod.PUT: return target.put;
            case RequestMethod.PATCH: return target.patch;
            case RequestMethod.OPTIONS: return target.options;
            case RequestMethod.HEAD: return target.head;
            default: {
                return target.get;
            }
        }
    }
}