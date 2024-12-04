import 'reflect-metadata';
import {ApplicationConfig} from "../application-config";
import {Controller} from "../../common/interfaces/controllers/controller.interface";
import {ExceptionsHandler} from "../exceptions/exceptions-handler";
import {BaseExceptionFilterContext} from "../exceptions/base-exception-filter-context";
import {EXCEPTION_FILTERS_METADATA} from "../../common/constants";
import {isEmpty} from "../../common/shared.utils";
import {RouterProxyCallback} from "./router-proxy";

export class RouterExceptionFilters extends BaseExceptionFilterContext {
    constructor(private readonly config: ApplicationConfig) {
        super();
    }

    public create(instance: Controller, callback: RouterProxyCallback): ExceptionsHandler {
        const exceptionHandler = new ExceptionsHandler();
        // const filters = this.createContext(instance, callback, EXCEPTION_FILTERS_METADATA);
        // if (isEmpty(filters)) {
        //     return exceptionHandler;
        // }
        // exceptionHandler.setCustomFilters(filters);
        return exceptionHandler;
    }

    // public getGlobalMetadata<T extends any[]>(): T {
    //     return this.config.getGlobalFilters() as T;
    // }
}