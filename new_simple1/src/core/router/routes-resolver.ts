import { Application } from 'express';
import {Resolver} from "./interfaces/resolver.interface";
import {Logger} from "../../common/services/logger.service";
import {NestContainer} from "../injector/container";
import {ApplicationConfig} from "../application-config";
import {RouterExceptionFilters} from "./router-exception-filters";
import {RouterProxy} from "./router-proxy";
import {RouterExplorer} from "./interfaces/explorer.inteface";
import {MetadataScanner} from "../metadata-scanner";
import {ExpressRouterExplorer} from "./router-explorer";

export class RoutesResolver implements Resolver {
    private readonly logger = new Logger(RoutesResolver.name, true);
    private readonly routerProxy = new RouterProxy();
    private readonly routerExceptionsFilter: RouterExceptionFilters;
    private readonly routerBuilder: RouterExplorer;

    constructor(
        private readonly container: NestContainer,
        private readonly expressAdapter,
        private readonly config: ApplicationConfig) {

        this.routerExceptionsFilter = new RouterExceptionFilters(config);
        this.routerBuilder = new ExpressRouterExplorer(
            new MetadataScanner(), this.routerProxy, expressAdapter,
            this.routerExceptionsFilter, config, this.container,
        );
    }

    public resolve(express: Application) {
        // const modules = this.container.getModules();
        // modules.forEach(({ routes }, moduleName) => this.setupRouters(routes, moduleName, express));
    }
    //
    // public setupRouters(
    //     routes: Map<string, InstanceWrapper<Controller>>,
    //     moduleName: string,
    //     express: Application) {
    //
    //     routes.forEach(({ instance, metatype }) => {
    //         const path = this.routerBuilder.fetchRouterPath(metatype);
    //         const controllerName = metatype.name;
    //
    //         this.logger.log(ControllerMappingMessage(controllerName, path));
    //
    //         const router = this.routerBuilder.explore(instance, metatype, moduleName);
    //         express.use(path, router);
    //     });
    //     this.setupExceptionHandler(express);
    // }

    public setupExceptionHandler(express: Application) {
        const callback = (err, req, res, next) => {
            throw err;
        };
        const exceptionHandler = this.routerExceptionsFilter.create({}, callback as any);
        const proxy = this.routerProxy.createExceptionLayerProxy(callback, exceptionHandler);
        express.use(proxy);
    }
}