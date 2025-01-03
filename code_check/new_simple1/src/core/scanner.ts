import 'reflect-metadata';

import {MetadataScanner} from "./metadata-scanner";
import {NestContainer} from "./injector/container";
import {NestModuleMetatype} from "../common/interfaces/modules/module-metatype.interface";
import {Logger} from "../common/services/logger.service";
import {metadata} from "../common/constants";
import {Module} from "./injector/module";
import {Metatype} from "../common/interfaces/metatype.interface";
import {Controller} from "../common/interfaces/controllers/controller.interface";
// import {NestModuleMetatype} from "../common/interfaces/modules/module-metatype.interface";
// import {GATEWAY_MIDDLEWARES, GUARDS_METADATA, INTERCEPTORS_METADATA, metadata} from "../common/constants";
// import {Metatype} from "../common/interfaces/metatype.interface";
// import {Injectable} from "../common/interfaces/injectable.interface";
// import {Controller} from "../common/interfaces/controllers/controller.interface";


export class DependenciesScanner {
    private logger = new Logger('DependenciesScanner', true);

    constructor(
        private readonly container: NestContainer,
        private readonly metadataScanner: MetadataScanner) {}

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
            // this.reflectComponents(metatype, token);
            this.reflectControllers(metatype, token);
            // this.reflectExports(metatype, token);
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
            // this.reflectDynamicMetadata(route, token);   // gurad, interceptor
        });
    }

    public storeRoute(route: Metatype<Controller>, token: string) {
        this.container.addController(route, token);
    }


    //

    //
    // public reflectComponents(module: NestModuleMetatype, token: string) {
    //     const components = this.reflectMetadata(module, metadata.COMPONENTS);
    //     components.map((component) => {
    //         this.storeComponent(component, token);
    //         this.reflectComponentMetadata(component, token);
    //         this.reflectDynamicMetadata(component, token);
    //     });
    // }
    //
    // public reflectComponentMetadata(component: Metatype<Injectable>, token: string) {
    //     this.reflectGatewaysMiddlewares(component, token);
    // }
    //
    //
    //
    // public reflectDynamicMetadata(obj: Metatype<Injectable>, token: string) {
    //     if (!obj.prototype) { return; }
    //
    //     this.reflectGuards(obj, token);
    //     this.reflectInterceptors(obj, token);
    // }
    //
    // public reflectExports(module: NestModuleMetatype, token: string) {
    //     const exports = this.reflectMetadata(module, metadata.EXPORTS);
    //     exports.map((exportedComponent) => this.storeExportedComponent(exportedComponent, token));
    // }
    //
    // public reflectGatewaysMiddlewares(component: Metatype<Injectable>, token: string) {
    //     const middlewares = this.reflectMetadata(component, GATEWAY_MIDDLEWARES);
    //     middlewares.map((middleware) => this.storeComponent(middleware, token));
    // }
    //
    // public reflectGuards(component: Metatype<Injectable>, token: string) {
    //     const controllerGuards = this.reflectMetadata(component, GUARDS_METADATA);
    //     const methodsGuards = this.metadataScanner.scanFromPrototype(
    //       null, component.prototype, this.reflectKeyMetadata.bind(this, component, GUARDS_METADATA),
    //     );
    //     const flattenMethodsGuards = methodsGuards.reduce<any[]>((a: any[], b) => a.concat(b), []);
    //     [...controllerGuards, ...flattenMethodsGuards].map((guard) => this.storeInjectable(guard, token));
    // }
    //
    // public reflectInterceptors(component: Metatype<Injectable>, token: string) {
    //     const controllerInterceptors = this.reflectMetadata(component, INTERCEPTORS_METADATA);
    //     const methodsInterceptors = this.metadataScanner.scanFromPrototype(
    //       null, component.prototype, this.reflectKeyMetadata.bind(this, component, INTERCEPTORS_METADATA),
    //     );
    //     const flattenMethodsInterceptors = methodsInterceptors.reduce<any[]>((a: any[], b) => a.concat(b), []);
    //     [...controllerInterceptors, ...flattenMethodsInterceptors].map((guard) => this.storeInjectable(guard, token));
    // }
    //
    // public reflectKeyMetadata(component: Metatype<Injectable>, key: string, method: string) {
    //     const descriptor = Reflect.getOwnPropertyDescriptor(component.prototype, method);
    //     return descriptor ? Reflect.getMetadata(key, descriptor.value) : undefined;
    // }
    //

    //
    // public storeComponent(component: Metatype<Injectable>, token: string) {
    //     this.container.addComponent(component, token);
    // }
    //
    // public storeInjectable(component: Metatype<Injectable>, token: string) {
    //     this.container.addInjectable(component, token);
    // }
    //
    // public storeExportedComponent(exportedComponent: Metatype<Injectable>, token: string) {
    //     this.container.addExportedComponent(exportedComponent, token);
    // }
}