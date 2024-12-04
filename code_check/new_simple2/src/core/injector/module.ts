import {Metatype} from "../../common/interfaces/metatype.interface";
import {NestModuleMetatype} from "../../common/interfaces/modules/module-metatype.interface";
import {isFunction} from "../../common/shared.utils";
import {InstanceWrapper} from "./container";
import {Logger} from "../../common/services/logger.service";
import {ModuleRef} from "./module-ref";
import {Injectable} from "../../common/interfaces/injectable.interface";
import {Reflector} from "../services/reflector.service";
import {Controller} from "../../common/interfaces/controllers/controller.interface";

export type OpaqueToken = string | symbol | object | Metatype<any>;

export class Module {
    private logger = new Logger('Module', true);
    private _relatedModules = new Set<Module>();
    private _components = new Map<any, InstanceWrapper<Injectable>>();
    private _routes = new Map<string, InstanceWrapper<Controller>>();
    private _exports = new Set<string>();
    private _injectables = new Map<any, InstanceWrapper<Injectable>>();

    constructor(
        private _metatype: NestModuleMetatype,
        private _scope: NestModuleMetatype[]) {
        this.logger.log(`constructor() _metatype: ${_metatype}, _scope: ${_scope}`);
        this.addCoreInjectables();
    }
    public addCoreInjectables() {
        this.addModuleRef();
        this.addModuleAsComponent();
        this.addReflector();
    }

    public addModuleRef() {
        const moduleRef = this.createModuleRefMetatype(this._components);
        this.logger.log(`addModuleRef() moduleRef: ${moduleRef}, ModuleRef.name: ${ModuleRef.name}`);
        this._components.set(ModuleRef.name, {
            name: ModuleRef.name,
            metatype: ModuleRef as any,
            isResolved: true,
            instance: new moduleRef(),
        });
    }

    public createModuleRefMetatype(components: any) {
        this.logger.log(`createModuleRefMetatype() components: ${components}`); // components: [object Map]
        return class {
            public readonly components = components;

            public get<T>(type: OpaqueToken): T | null {
                const name = isFunction(type) ? (type as Metatype<any>).name : type;
                const exists = this.components.has(name);

                return exists ? this.components.get(name).instance as T : null;
            }
        };
    }

    public addModuleAsComponent() {
        this._components.set(this._metatype.name, {
            name: this._metatype.name,
            metatype: this._metatype,
            isResolved: false,
            instance: null,
        });
    }

    public addReflector() {
        this._components.set(Reflector.name, {
            name: Reflector.name,
            metatype: Reflector,
            isResolved: false,
            instance: null,
        });
    }

    get metatype(): NestModuleMetatype {
        return this._metatype;
    }

    get scope(): NestModuleMetatype[] {
        return this._scope;
    }

    public addRelatedModule(relatedModule: any) {
        this._relatedModules.add(relatedModule);
    }

    public addRoute(route: Metatype<Controller>) {
        this.logger.log(`addRoute() route: ${route}`);
        this._routes.set(route.name, {
            name: route.name,
            metatype: route,
            instance: null,
            isResolved: false,
        });
    }

    get routes(): Map<string, InstanceWrapper<Controller>> {
        return this._routes;
    }

    get components(): Map<string, InstanceWrapper<Injectable>> {
        return this._components;
    }

    get relatedModules(): Set<Module> {
        return this._relatedModules;
    }

    get exports(): Set<string> {
        return this._exports;
    }

    get injectables(): Map<string, InstanceWrapper<Injectable>> {
        return this._injectables;
    }
}