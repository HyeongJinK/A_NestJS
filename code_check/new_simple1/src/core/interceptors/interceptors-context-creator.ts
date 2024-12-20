import 'reflect-metadata';
import {ContextCreator} from "../helpers/context-creator";
import {NestContainer} from "../injector/container";
import {ConfigurationProvider} from "../../common/interfaces/configuration-provider.interface";
import {Controller} from "../../common/interfaces/controllers/controller.interface";
import {INTERCEPTORS_METADATA} from "../../common/constants";
import {NestInterceptor} from "../../common/interfaces/nest-interceptor.interface";
import {isEmpty, isFunction, isUndefined} from "../../common/shared.utils";
import iterate from "iterare";


export class InterceptorsContextCreator extends ContextCreator {
    private moduleContext: string;

    constructor(
        private readonly container: NestContainer,
        private readonly config?: ConfigurationProvider) {
        super();
    }

    public create(instance: Controller, callback: (...args) => any, module: string): NestInterceptor[] {
        this.moduleContext = module;
        return this.createContext(instance, callback, INTERCEPTORS_METADATA);
    }

    public createConcreteContext<T extends any[], R extends any[]>(metadata: T): R {
        if (isUndefined(metadata) || isEmpty(metadata) || !this.moduleContext) {
            return [] as R;
        }
        const isGlobalMetadata = metadata === this.getGlobalMetadata();
        return isGlobalMetadata ?
            this.createGlobalMetadataContext<T, R>(metadata) :
            iterate(metadata).filter((metatype: any) => metatype && metatype.name)
                .map((metatype) => this.getInstanceByMetatype(metatype))
                .filter((wrapper: any) => wrapper && wrapper.instance)
                .map((wrapper) => wrapper.instance)
                .filter((interceptor: NestInterceptor) => interceptor && isFunction(interceptor.intercept))
                .toArray() as R;
    }

    public createGlobalMetadataContext<T extends any[], R extends any[]>(metadata: T): R {
        return iterate(metadata)
            .filter((interceptor) => interceptor && interceptor.intercept && isFunction(interceptor.intercept))
            .toArray() as R;
    }

    public getInstanceByMetatype(metatype): { instance: any } | undefined {
        const collection = this.container.getModules();
        const module = collection.get(this.moduleContext);
        if (!module) {
            return undefined;
        }
        return module.injectables.get((metatype as any).name);
    }
    //
    // public getGlobalMetadata<T extends any[]>(): T {
    //     if (!this.config) {
    //         return [] as T;
    //     }
    //     return this.config.getGlobalInterceptors() as T;
    // }
}