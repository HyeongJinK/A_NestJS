import 'reflect-metadata';
import {Metatype} from "../../common/interfaces/metatype.interface";
import {NestModuleMetatype} from "../../common/interfaces/modules/module-metatype.interface";
import {InvalidModuleException} from "../errors/exceptions/invalid-module.exception";
import {Module} from "./module";
import {ModuleTokenFactory} from "./module-token-factory";
import {Logger} from "../../common/services/logger.service";
import {UnknownModuleException} from "../errors/exceptions/unknown-module.exception";
import {Controller} from "../../common/interfaces/controllers/controller.interface";

// import { UnknownModuleException } from '../errors/exceptions/unknown-module.exception';
// import { ModuleTokenFactory } from './module-token-factory';
// import { InvalidModuleException } from './../errors/exceptions/invalid-module.exception';
// import {NestModuleMetatype} from "../../common/interfaces/modules/module-metatype.interface";
// import {Module} from "./module";
// import {Injectable} from "../../common/interfaces/injectable.interface";
// import {Controller} from "../../common/interfaces/controllers/controller.interface";

export class NestContainer {
    private logger = new Logger('NestContainer', true);
    private readonly modules = new Map<string, Module>();
    private readonly moduleTokenFactory = new ModuleTokenFactory();

    public addModule(metatype: NestModuleMetatype, scope: NestModuleMetatype[]) {
        if (!metatype) {
            throw new InvalidModuleException(scope);
        }
        const token = this.moduleTokenFactory.create(metatype, scope);
        this.logger.log(`addModule() token: ${token}`); // addModule() token: {"module":"ApplicationModule","scope":"global"}
        if (this.modules.has(token)) {
            return;
        }
        this.modules.set(token, new Module(metatype, scope));
    }

    public getModules(): Map<string, Module> {
        return this.modules;
    }

    public addRelatedModule(relatedModule: NestModuleMetatype, token: string) {
        if (!this.modules.has(token)) return;

        const module: Module = <Module>this.modules.get(token);
        const parent = module.metatype;

        const relatedModuleToken = this.moduleTokenFactory.create(
            relatedModule,
            [...module.scope, parent],
        );
        const related: Module = <Module>this.modules.get(relatedModuleToken);
        module.addRelatedModule(related);
    }

    public addController(controller: Metatype<Controller>, token: string) {
        if (!this.modules.has(token)) {
            throw new UnknownModuleException();
        }
        const module = this.modules.get(token);
        module && module.addRoute(controller);
    }


    //
    // public addComponent(component: Metatype<Injectable>, token: string) {
    //     if (!this.modules.has(token)) {
    //         throw new UnknownModuleException();
    //     }
    //     const module = <Module> this.modules.get(token);
    //     module.addComponent(component);
    // }
    //
    // public addInjectable(injectable: Metatype<Injectable>, token: string) {
    //     if (!this.modules.has(token)) {
    //         throw new UnknownModuleException();
    //     }
    //     const module = <Module> this.modules.get(token);
    //     module.addInjectable(injectable);
    // }
    //
    //
    // public addExportedComponent(exportedComponent: Metatype<Injectable>, token: string) {
    //     if (!this.modules.has(token)) {
    //         throw new UnknownModuleException();
    //     }
    //     const module = <Module> this.modules.get(token);
    //     module.addExportedComponent(exportedComponent);
    // }
    //

    //
    // public clear() {
    //     this.modules.clear();
    // }
    //
    // public replace(toReplace, options: any & { scope: any[] | null }) {
    //     [...this.modules.values()].forEach((module) => {
    //         module.replace(toReplace, options);
    //     });
    // }
}

export interface InstanceWrapper<T> {
    name: any;
    metatype: Metatype<T>;
    instance: T | null;
    isResolved: boolean | undefined;
    isPending?: boolean | undefined;
    done$?: Promise<void> | undefined;
    inject?: Metatype<any>[] | undefined;
    isNotMetatype?: boolean | undefined;
    forwardRef?: boolean | undefined;
    async?: boolean | undefined;
}