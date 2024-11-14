import 'reflect-metadata';
import iterate from 'iterare';
import {isEmpty, isFunction, isUndefined} from "../../common/shared.utils";
import {FILTER_CATCH_EXCEPTIONS} from "../../common/constants";
import {Metatype} from "../../common/interfaces/metatype.interface";
import {ContextCreator} from "../helpers/context-creator";
import {ExceptionFilter} from "../../common/exceptions/exception-filter.interface";


export class BaseExceptionFilterContext extends ContextCreator {
    public createConcreteContext<T extends any[], R extends any[]>(metadata: T): R {
         if (isUndefined(metadata) || isEmpty(metadata)) {
            return [] as R;
         }
         return iterate(metadata)
                .filter((instance) => instance.catch && isFunction(instance.catch))
                .map((instance) => ({
                    func: instance.catch.bind(instance),
                    exceptionMetatypes: this.reflectCatchExceptions(instance),
                }))
                .toArray() as R;
    }

    public reflectCatchExceptions(instance: ExceptionFilter): Metatype<any>[] {
        const prototype = Object.getPrototypeOf(instance);
        return Reflect.getMetadata(FILTER_CATCH_EXCEPTIONS, prototype.constructor) || [];
    }
}