import 'reflect-metadata';

import {NestContainer} from "./injector/container";
import {NestModuleMetatype} from "../common/interfaces/modules/module-metatype.interface";
import {Logger} from "../common/services/logger.service";
import {metadata} from "../common/constants";
import {Module} from "./injector/module";
import {Metatype} from "../common/interfaces/metatype.interface";
import {Controller} from "../common/interfaces/controllers/controller.interface";

export class DependenciesScanner {
    private logger = new Logger('DependenciesScanner', true);

    constructor(
        private readonly container: NestContainer) {}

    public scan(module: NestModuleMetatype) {
        this.logger.log(`scan() module: ${module}`);
        this.scanForModules(module);
        this.scanModulesForDependencies();
    }

    public scanForModules(module: NestModuleMetatype, scope: NestModuleMetatype[] = []) {
        this.logger.log(`scanForModules() module: ${module}`);
        this.storeModule(module, scope);

        const importedModules = this.reflectMetadata(module, metadata.MODULES); // metadata.MODULES = 'modules'
        this.logger.log(`scanForModules() importedModules: ${importedModules}`);
        importedModules.map((innerModule: any) => {
            this.scanForModules(innerModule, [...scope, module]);
        });
    }

    public storeModule(module: any, scope: NestModuleMetatype[]) {
        this.logger.log(`storeModule() module: ${module}`);
        if (module && module.forwardRef) {
            this.logger.log(`storeModule() module.forwardRef: ${module.forwardRef()}`);
            return this.container.addModule(module.forwardRef(), scope);
        }
        this.container.addModule(module, scope);
    }

    public reflectMetadata(metatype: any, metadata: string) {
        return Reflect.getMetadata(metadata, metatype) || [];
    }

    public scanModulesForDependencies() {
        const modules: Map<string, Module> = this.container.getModules();

        modules.forEach(({ metatype }, token: any) => {
            this.reflectRelatedModules(metatype, token);
            this.reflectControllers(metatype, token);
        });
    }

    public reflectRelatedModules(module: NestModuleMetatype, token: string) {
        const modules = this.reflectMetadata(module, metadata.MODULES);
        this.logger.log(`reflectRelatedModules() modules: ${modules}`);
        modules.map((related: any) => this.storeRelatedModule(related, token));
    }

    public storeRelatedModule(related: any, token: string) {
        this.logger.log(`storeRelatedModule() related: ${related}, token: ${token}`);
        if (related.forwardRef) {
            return this.container.addRelatedModule(related.forwardRef(), token);
        }
        this.container.addRelatedModule(related, token);
    }

    public reflectControllers(module: NestModuleMetatype, token: string) {
        const routes = this.reflectMetadata(module, metadata.CONTROLLERS);
        this.logger.log(`reflectControllers() routes: ${routes}`);
        routes.map((route: any) => {
            this.storeRoute(route, token);
        });
    }

    public storeRoute(route: Metatype<Controller>, token: string) {
        this.container.addController(route, token);
    }
}