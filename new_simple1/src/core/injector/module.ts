// import { InstanceWrapper } from './container';
// import {Metatype} from "../../common/interfaces/metatype.interface";
// import {NestModuleMetatype} from "../../common/interfaces/modules/module-metatype.interface";
// import {Injectable} from "../../common/interfaces/injectable.interface";
// import {Controller} from "../../common/interfaces/controllers/controller.interface";
// import {NestModule} from "../../common/interfaces/modules/nest-module.interface";
// import {RuntimeException} from "../errors/exceptions/runtime.exception";
// import {ModuleRef} from "./module-ref";
// import {Reflector} from "../services/reflector.service";
// import {isFunction, isNil, isUndefined} from "../../common/utils/shared.utils";
// import { Injectable, Controller, NestModule } from '@nestjs/common/interfaces';
// import { NestModuleMetatype } from '@nestjs/common/interfaces/modules/module-metatype.interface';
// import { Metatype } from '@nestjs/common/interfaces/metatype.interface';
// import { ModuleRef } from './module-ref';
// import { isFunction, isNil, isUndefined } from '@nestjs/common/utils/shared.utils';
// import { RuntimeException } from '../errors/exceptions/runtime.exception';
// import { Reflector } from '../services/reflector.service';

import {Metatype} from "../../common/interfaces/metatype.interface";
import {NestModuleMetatype} from "../../common/interfaces/modules/module-metatype.interface";
import {isFunction} from "../../common/shared.utils";
import {InstanceWrapper} from "./container";
import {Logger} from "../../common/services/logger.service";
import {ModuleRef} from "./module-ref";
import {Injectable} from "../../common/interfaces/injectable.interface";
import {Reflector} from "../services/reflector.service";
import {Controller} from "../../common/interfaces/controllers/controller.interface";

export interface CustomComponent {
    provide: any;
    name: string;
}
export type OpaqueToken = string | symbol | object | Metatype<any>;
export type CustomClass = CustomComponent & { useClass: Metatype<any> };
export type CustomFactory = CustomComponent & { useFactory: (...args: any[]) => any, inject?: Metatype<any>[] };
export type CustomValue = CustomComponent & { useValue: any };
// export type ComponentMetatype = Metatype<Injectable> | CustomFactory | CustomValue | CustomClass;

export class Module {
    private logger = new Logger('Module', true);
    private _relatedModules = new Set<Module>();
    private _components = new Map<any, InstanceWrapper<Injectable>>();
    private _routes = new Map<string, InstanceWrapper<Controller>>();

    // private _injectables = new Map<any, InstanceWrapper<Injectable>>();
    // private _exports = new Set<string>();

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






    //
    // get relatedModules(): Set<Module> {
    //     return this._relatedModules;
    // }
    //
    // get components(): Map<string, InstanceWrapper<Injectable>> {
    //     return this._components;
    // }
    //
    // get injectables(): Map<string, InstanceWrapper<Injectable>> {
    //     return this._injectables;
    // }
    //
    // get routes(): Map<string, InstanceWrapper<Controller>> {
    //     return this._routes;
    // }
    //
    // get exports(): Set<string> {
    //     return this._exports;
    // }
    //
    // get instance(): NestModule | undefined {
    //     if (!this._components.has(this._metatype.name)) {
    //         throw new RuntimeException();
    //     }
    //     const module = this._components.get(this._metatype.name);
    //     return (module && module.instance as NestModule);
    // }
    //

    //

    //

    //

    //

    //
    // public addInjectable(injectable: Metatype<Injectable>) {
    //     if (this.isCustomProvider(injectable)) {
    //         return this.addCustomProvider(injectable, this._injectables);
    //     }
    //     this._injectables.set(injectable.name, {
    //         name: injectable.name,
    //         metatype: injectable,
    //         instance: null,
    //         isResolved: false,
    //     });
    // }
    //
    // public addComponent(component: ComponentMetatype) {
    //     if (this.isCustomProvider(component)) {
    //         this.addCustomProvider(component, this._components);
    //         return;
    //     }
    //     this._components.set((component as Metatype<Injectable>).name, {
    //         name: (component as Metatype<Injectable>).name,
    //         metatype: component as Metatype<Injectable>,
    //         instance: null,
    //         isResolved: false,
    //     });
    // }
    //
    // public isCustomProvider(component: ComponentMetatype): component is CustomClass | CustomFactory | CustomValue  {
    //     return !isNil((component as CustomComponent).provide);
    // }
    //
    // public addCustomProvider(component: CustomFactory | CustomValue | CustomClass, collection: Map<string, any>) {
    //     const { provide } = component;
    //     const name = isFunction(provide) ? provide.name : provide;
    //     const comp = {
    //         ...component,
    //         name,
    //     };
    //
    //     if (this.isCustomClass(comp)) this.addCustomClass(comp, collection);
    //     else if (this.isCustomValue(comp)) this.addCustomValue(comp, collection);
    //     else if (this.isCustomFactory(comp)) this.addCustomFactory(comp, collection);
    // }
    //
    // public isCustomClass(component): component is CustomClass {
    //     return !isUndefined((component as CustomClass).useClass);
    // }
    //
    // public isCustomValue(component): component is CustomValue {
    //     return !isUndefined((component as CustomValue).useValue);
    // }
    //
    // public isCustomFactory(component): component is CustomFactory {
    //     return !isUndefined((component as CustomFactory).useFactory);
    // }
    //
    // public addCustomClass(component: CustomClass, collection: Map<string, any>) {
    //     const { provide, name, useClass } = component;
    //     collection.set(name, {
    //         name,
    //         metatype: useClass,
    //         instance: null,
    //         isResolved: false,
    //     });
    // }
    //
    // public addCustomValue(component: CustomValue, collection: Map<string, any>) {
    //     const { provide, name, useValue: value } = component;
    //     collection.set(name, {
    //         name,
    //         metatype: null,
    //         instance: value,
    //         isResolved: true,
    //         isNotMetatype: true,
    //         async: value instanceof Promise,
    //     });
    // }
    //
    // public addCustomFactory(component: CustomFactory, collection: Map<string, any>) {
    //     const { provide, name, useFactory: factory, inject } = component;
    //     collection.set(name, {
    //         name,
    //         metatype: factory as any,
    //         instance: null,
    //         isResolved: false,
    //         inject: inject || [],
    //         isNotMetatype: true,
    //     });
    // }
    //
    // public addExportedComponent(exportedComponent: ComponentMetatype) {
    //     if (this.isCustomProvider(exportedComponent)) {
    //         return this.addCustomExportedComponent(exportedComponent);
    //     }
    //     this._exports.add(exportedComponent.name);
    // }
    //
    // public addCustomExportedComponent(exportedComponent: CustomFactory | CustomValue | CustomClass) {
    //     this._exports.add(exportedComponent.provide);
    // }
    //


    //
    // public replace(toReplace, options) {
    //     if (options.isComponent) {
    //         return this.addComponent({ provide: toReplace, ...options });
    //     }
    //     this.addInjectable({
    //         provide: toReplace,
    //         ...options,
    //     });
    // }
    //

}