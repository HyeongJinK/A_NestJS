import 'reflect-metadata';
import {RouteParamtypes} from "../../common/enums/route-paramtypes.enum";
import {IRouteParamsFactory} from "./interfaces/route-params-factory.interface";
import {Controller} from "../../common/interfaces/controllers/controller.interface";
import {RouterResponseController} from "./router-response-controller";
import {ParamData, RouteParamsMetadata} from "../../decorators/route-params.decorator";
import {
    CUSTOM_ROUTE_AGRS_METADATA,
    HTTP_CODE_METADATA,
    PARAMTYPES_METADATA,
    ROUTE_ARGS_METADATA
} from "../../common/constants";
import {isFunction, isUndefined} from "../../common/shared.utils";
import {InterceptorsConsumer} from "../interceptors/interceptors-consumer";
import {InterceptorsContextCreator} from "../interceptors/interceptors-context-creator";
import {RequestMethod} from "../../common/enums/request-method.enum";
import {Logger} from "../../common/services/logger.service";

export interface ParamProperties {
    index: number;
    type: RouteParamtypes;
    data: ParamData;
    extractValue: (req, res, next) => any;
}

export class RouterExecutionContext {
    private readonly logger = new Logger('RouterExecutionContext', true);
    private readonly responseController = new RouterResponseController();
    constructor(
        private readonly paramsFactory: IRouteParamsFactory,
        private readonly interceptorsContextCreator: InterceptorsContextCreator,
        private readonly interceptorsConsumer: InterceptorsConsumer
    ) {}

    public create(instance: Controller
                  , callback: (...args) => any
                  , methodName: string
                  , module: string
                  , requestMethod: RequestMethod
    ) {
        this.logger.log(`create() instance: ${instance} 
        callback: ${callback} 
        methodName: ${methodName} 
        module: ${module} 
        requestMethod: ${requestMethod}`);
        const metadata = this.reflectCallbackMetadata(instance, methodName) || {};
        const keys = Object.keys(metadata);
        const argsLength = this.getArgumentsLength(keys, metadata);
        const paramtypes = this.reflectCallbackParamtypes(instance, methodName);
        const interceptors = this.interceptorsContextCreator.create(instance, callback, module);
        const httpCode = this.reflectHttpStatusCode(callback);
        const paramsMetadata = this.exchangeKeysForValues(keys, metadata);
        const isResponseHandled = paramsMetadata.some(({ type }) => type === RouteParamtypes.RESPONSE || type === RouteParamtypes.NEXT);
        const paramsOptions = this.mergeParamsMetatypes(paramsMetadata, paramtypes);

        return async (req, res, next) => {
            const args = this.createNullArray(argsLength);

            await Promise.all(paramsOptions.map(async (param) => {
                const { index, extractValue, type, data, metatype
                } = param;
                const value = extractValue(req, res, next);

                args[index] = await this.getParamValue(
                    value, { metatype, type, data }
                );
            }));
            this.logger.log(`create() args: ${args}`);
            const handler = () => callback.apply(instance, args);
            const result = await this.interceptorsConsumer.intercept(
                interceptors, req, instance, callback, handler,
            );
            return !isResponseHandled ?
                this.responseController.apply(result, res, requestMethod, httpCode) :
                undefined;
        };
    }

    public reflectCallbackMetadata(instance: Controller, methodName: string): RouteParamsMetadata {
        return Reflect.getMetadata(ROUTE_ARGS_METADATA, instance, methodName);
    }

    public getArgumentsLength(keys: string[], metadata: RouteParamsMetadata): number {
        return Math.max(...keys.map(key => metadata[key].index)) + 1;
    }

    public reflectCallbackParamtypes(instance: Controller, methodName: string): any[] {
        return Reflect.getMetadata(PARAMTYPES_METADATA, instance, methodName);
    }

    public reflectHttpStatusCode(callback: (...args) => any): number {
        return Reflect.getMetadata(HTTP_CODE_METADATA, callback);
    }

    public exchangeKeysForValues(keys: string[], metadata: RouteParamsMetadata): ParamProperties[] {
        return keys.map(key => {
            const { index, data, pipes } = metadata[key];
            const type = this.mapParamType(key);

            if (key.includes(CUSTOM_ROUTE_AGRS_METADATA)) {
                const { factory } = metadata[key];
                const customExtractValue = this.getCustomFactory(factory, data);
                return { index, extractValue: customExtractValue, type, data, pipes };
            }
            const extractValue = (req, res, next) => this.paramsFactory.exchangeKeyForValue(type, data, { req, res, next });
            return { index, extractValue, type, data, pipes };
        });
    }

    public mapParamType(key: string): RouteParamtypes | number {
        const keyPair = key.split(':');
        return Number(keyPair[0]);
    }

    public getCustomFactory(factory: (...args) => void, data): (...args) => any {
      return !isUndefined(factory) && isFunction(factory)
        ? (req, res, next) => factory(data, req)
        : () => null;
    }

    public mergeParamsMetatypes(
      paramsProperties: ParamProperties[],
      paramtypes: any[],
    ): (ParamProperties & { metatype?: any })[] {
      if (!paramtypes) {
        return paramsProperties;
      }
      return paramsProperties.map((param) => ({ ...param, metatype: paramtypes[param.index] }));
    }

    public createNullArray(length: number): any[] {
        return Array.apply(null, { length }).fill(null);
    }

    public async getParamValue<T>(
        value: T,
        { metatype, type, data }
    ): Promise<any> {
        return Promise.resolve(value);
    }
}