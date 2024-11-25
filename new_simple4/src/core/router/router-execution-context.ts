import 'reflect-metadata';
import {RouteParamtypes} from "../../common/enums/route-paramtypes.enum";
import {Controller} from "../../common/interfaces/controllers/controller.interface";
import {RouterResponseController} from "./router-response-controller";
import {ParamData, RouteParamsMetadata} from "../../decorators/route-params.decorator";
import {
    HTTP_CODE_METADATA,
    PARAMTYPES_METADATA,
    ROUTE_ARGS_METADATA
} from "../../common/constants";
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
    constructor() {}

    public create(instance: Controller
                  , callback: (...args) => any
                  , methodName: string
                  , module: string
                  , requestMethod: RequestMethod
    ) {
        this.logger.log(`create() instance: ${JSON.stringify(instance)}     //  {"asdfg":"test"}
        callback: ${callback} 
        methodName: ${methodName} 
        module: ${module} 
        requestMethod: ${requestMethod}`);
        const metadata =  Reflect.getMetadata(ROUTE_ARGS_METADATA, instance, methodName) || {};     // ROUTE_ARGS_METADATA: __routeArguments__
        const keys = Object.keys(metadata); // key = [`${paramtype}:${index}`]   paramtype: RouteParamtypes.QUERY, index: 0
        const argsLength = Math.max(...keys.map(key => metadata[key].index)) + 1;
        const paramtypes = Reflect.getMetadata(PARAMTYPES_METADATA, instance, methodName);  // design:paramtypes
        this.logger.log_blue(`create() paramtypes: ${paramtypes}`);
        const httpCode = Reflect.getMetadata(HTTP_CODE_METADATA, callback);

        const paramsOptions = this.exchangeKeysForValues(keys, metadata);
        this.logger.log_blue(`create() paramsMetadata: ${JSON.stringify(paramsOptions)}`); // [{"index":0,"type":4,"data":"id","pipes":[]}]
        // some: 하나라도 만족하면 true
        const isResponseHandled = paramsOptions.some(({ type }) => type === RouteParamtypes.RESPONSE || type === RouteParamtypes.NEXT);

        return async (req, res, next) => {
            const args = this.createNullArray(argsLength);
            this.logger.log(`create() paramsOptions: ${paramsOptions} argsLength: ${argsLength}`);

            // 파라미터 추출 및 apply에 전달하기 위해 args에 배열로 저장
            await Promise.all(paramsOptions.map(async (param) => {
                this.logger.log_cyan(`create() param: ${JSON.stringify(param)}`);
                const { index, extractValue} = param;
                const value = extractValue(req, res, next); // case RouteParamtypes.QUERY: return data ? req.query[data] : req.query;
                this.logger.log_cyan(`create() value: ${value} extractValue: ${extractValue}`);
                args[index] = await this.getParamValue(value);  // value: test or test2.... id 값
            }));

            const result = callback.apply(instance, args);

            this.logger.log_cyan(`create() result: ${result}`);      // "test"
            // Response 처리, HttpStatus 처리
            return !isResponseHandled ?
                this.responseController.apply(result, res, requestMethod, httpCode) :
                undefined;
        };
    }

    public exchangeKeysForValues(keys: string[], metadata: RouteParamsMetadata): ParamProperties[] {
        return keys.map(key => {
            const { index, data } = metadata[key];
            this.logger.log_blue(`exchangeKeysForValues() index: ${index} data: ${data} key: ${key}`);
            const type = this.mapParamType(key);    // RouteParamtypes.QUERY:index 에서 인덱스를 제외하고 타입이 어떤 값이 알기 위해 타입값만 가져오기

            const extractValue =
                (req, res, next) => this.exchangeKeyForValue(type, data, { req, res, next });

            return { index, extractValue, type, data };
        });
    }

    public mapParamType(key: string): RouteParamtypes | number {
        const keyPair = key.split(':');
        return Number(keyPair[0]);
    }

    public exchangeKeyForValue(key: RouteParamtypes, data, { req, res, next }) {
        switch (key) {
            case RouteParamtypes.NEXT: return next;
            case RouteParamtypes.REQUEST: return req;
            case RouteParamtypes.RESPONSE: return res;
            case RouteParamtypes.BODY: return data && req.body ? req.body[data] : req.body;
            case RouteParamtypes.PARAM: return data ? req.params[data] : req.params;
            case RouteParamtypes.QUERY: return data ? req.query[data] : req.query;
            case RouteParamtypes.HEADERS: return data ? req.headers[data] : req.headers;
            case RouteParamtypes.SESSION: return req.session;
            default: return null;
        }
    }

    public createNullArray(length: number): any[] {
        return Array.apply(null, { length }).fill(null);
    }

    public async getParamValue<T>(
        value: T,
    ): Promise<any> {
        return Promise.resolve(value);
    }
}