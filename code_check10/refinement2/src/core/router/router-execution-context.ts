import {
  FORBIDDEN_MESSAGE,
  GuardsConsumer,
  GuardsContextCreator,
} from '../guards';
import { ContextUtils } from '../helpers/context-utils';
import { ExecutionContextHost } from '../helpers/execution-context-host';
import {
  HandleResponseFn,
  HandlerMetadata,
  HandlerMetadataStorage,
  HandlerResponseBasicFn,
} from '../helpers/handler-metadata-storage';
import { STATIC_CONTEXT } from '../injector/constants';
import { InterceptorsConsumer } from '../interceptors/interceptors-consumer';
import { InterceptorsContextCreator } from '../interceptors/interceptors-context-creator';
import { IRouteParamsFactory } from './interfaces/route-params-factory.interface';
import {
  CustomHeader,
  RedirectResponse,
  RouterResponseController,
} from './router-response-controller';
import {RouteParamtypes} from "../../common/enums/route-paramtypes.enum";
import {ParamData, RouteParamMetadata} from "../../common/decorators";
import {CanActivate, ContextType, Controller, HttpServer, PipeTransform} from "../../common/interfaces";
import {RequestMethod} from "../../common/enums";
import {
  CUSTOM_ROUTE_ARGS_METADATA,
  HEADERS_METADATA,
  HTTP_CODE_METADATA,
  REDIRECT_METADATA,
  RENDER_METADATA,
  ROUTE_ARGS_METADATA
} from "../../common/constants";
import {isEmpty, isString} from "../../common/utils/shared.utils";
import {ForbiddenException} from "../../common/exceptions";

export interface ParamProperties {
  index: number;
  type: RouteParamtypes | string;
  data: ParamData;
  // pipes: PipeTransform[];
  extractValue: <TRequest, TResponse>(
    req: TRequest,
    res: TResponse,
    next: Function,
  ) => any;
}

export class RouterExecutionContext {
  private readonly handlerMetadataStorage = new HandlerMetadataStorage();
  private readonly contextUtils = new ContextUtils();
  private readonly responseController: RouterResponseController;

  constructor(
    private readonly paramsFactory: IRouteParamsFactory,
    private readonly guardsContextCreator: GuardsContextCreator,
    private readonly guardsConsumer: GuardsConsumer,
    private readonly interceptorsContextCreator: InterceptorsContextCreator,
    private readonly interceptorsConsumer: InterceptorsConsumer,
    readonly applicationRef: HttpServer,
  ) {
    this.responseController = new RouterResponseController(applicationRef);
  }

  public create(
    instance: Controller,
    callback: (...args: any[]) => unknown,
    methodName: string,
    moduleKey: string,
    requestMethod: RequestMethod,
    contextId = STATIC_CONTEXT,
    inquirerId?: string,
  ) {
    const contextType: ContextType = 'http';
    const {
      argsLength,
      fnHandleResponse,
      paramtypes,
      getParamsMetadata,
      httpStatusCode,
      responseHeaders,
      hasCustomHeaders,
    } = this.getMetadata(
      instance,
      callback,
      methodName,
      moduleKey,
      requestMethod,
      contextType,
    );

    const paramsOptions = this.contextUtils.mergeParamsMetatypes(
      getParamsMetadata(moduleKey, contextId, inquirerId),
      paramtypes,
    );

    const guards = this.guardsContextCreator.create(
      instance,
      callback,
      moduleKey,
      contextId,
      inquirerId,
    );
    const interceptors = this.interceptorsContextCreator.create(
      instance,
      callback,
      moduleKey,
      contextId,
      inquirerId,
    );

    const fnCanActivate = this.createGuardsFn(
      guards,
      instance,
      callback,
      contextType,
    );

    const handler =
      <TRequest, TResponse>(
        args: any[],
        req: TRequest,
        res: TResponse,
        next: Function,
      ) =>
      async () => {
        return callback.apply(instance, args);
      };

    return async <TRequest, TResponse>(
      req: TRequest,
      res: TResponse,
      next: Function,
    ) => {
      const args = this.contextUtils.createNullArray(argsLength);
      fnCanActivate && (await fnCanActivate([req, res, next]));

      this.responseController.setStatus(res, httpStatusCode);
      hasCustomHeaders &&
        this.responseController.setHeaders(res, responseHeaders);

      const result = await this.interceptorsConsumer.intercept(
        interceptors,
        [req, res, next],
        instance,
        callback,
        handler(args, req, res, next),
        contextType,
      );
      await (fnHandleResponse as HandlerResponseBasicFn)(result, res, req);
    };
  }

  public getMetadata<TContext extends ContextType = ContextType>(
    instance: Controller,
    callback: (...args: any[]) => any,
    methodName: string,
    moduleKey: string,
    requestMethod: RequestMethod,
    contextType: TContext,
  ): HandlerMetadata {
    const cacheMetadata = this.handlerMetadataStorage.get(instance, methodName);
    if (cacheMetadata) {
      return cacheMetadata;
    }
    const metadata =
      this.contextUtils.reflectCallbackMetadata(
        instance,
        methodName,
        ROUTE_ARGS_METADATA,
      ) || {};
    const keys = Object.keys(metadata);
    const argsLength = this.contextUtils.getArgumentsLength(keys, metadata);
    const paramtypes = this.contextUtils.reflectCallbackParamtypes(
      instance,
      methodName,
    );

    const contextFactory = this.contextUtils.getContextFactory(
      contextType,
      instance,
      callback,
    );
    const getParamsMetadata = (
      moduleKey: string,
      contextId = STATIC_CONTEXT,
      inquirerId?: string,
    ) =>
      this.exchangeKeysForValues(
        keys,
        metadata,
        moduleKey,
        contextId,
        inquirerId,
        contextFactory,
      );

    const paramsMetadata = getParamsMetadata(moduleKey);
    const isResponseHandled = this.isResponseHandled(
      instance,
      methodName,
      paramsMetadata,
    );

    const httpRedirectResponse = this.reflectRedirect(callback);
    const fnHandleResponse = this.createHandleResponseFn(
      callback,
      isResponseHandled,
      httpRedirectResponse,
    );

    const httpCode = this.reflectHttpStatusCode(callback);
    const httpStatusCode = httpCode
      ? httpCode
      : this.responseController.getStatusByMethod(requestMethod);

    const responseHeaders = this.reflectResponseHeaders(callback);
    const hasCustomHeaders = !isEmpty(responseHeaders);
    const handlerMetadata: HandlerMetadata = {
      argsLength,
      fnHandleResponse,
      paramtypes,
      getParamsMetadata,
      httpStatusCode,
      hasCustomHeaders,
      responseHeaders,
    };
    this.handlerMetadataStorage.set(instance, methodName, handlerMetadata);
    return handlerMetadata;
  }

  public reflectRedirect(
    callback: (...args: unknown[]) => unknown,
  ): RedirectResponse {
    return Reflect.getMetadata(REDIRECT_METADATA, callback);
  }

  public reflectHttpStatusCode(
    callback: (...args: unknown[]) => unknown,
  ): number {
    return Reflect.getMetadata(HTTP_CODE_METADATA, callback);
  }

  public reflectRenderTemplate(
    callback: (...args: unknown[]) => unknown,
  ): string {
    return Reflect.getMetadata(RENDER_METADATA, callback);
  }

  public reflectResponseHeaders(
    callback: (...args: unknown[]) => unknown,
  ): CustomHeader[] {
    return Reflect.getMetadata(HEADERS_METADATA, callback) || [];
  }

  public exchangeKeysForValues(
    keys: string[],
    metadata: Record<number, RouteParamMetadata>,
    moduleContext: string,
    contextId = STATIC_CONTEXT,
    inquirerId?: string,
    contextFactory?: (args: unknown[]) => ExecutionContextHost,
  ): ParamProperties[] {
    return keys.map(key => {
      const { index, data } = metadata[key];

      const type = this.contextUtils.mapParamType(key);

      if (key.includes(CUSTOM_ROUTE_ARGS_METADATA)) {
        const { factory } = metadata[key];
        const customExtractValue = this.contextUtils.getCustomFactory(
          factory,
          data,
          contextFactory,
        );
        return { index, extractValue: customExtractValue, type, data };
      }
      const numericType = Number(type);
      const extractValue = <TRequest, TResponse>(
        req: TRequest,
        res: TResponse,
        next: Function,
      ) =>
        this.paramsFactory.exchangeKeyForValue(numericType, data, {
          req,
          res,
          next,
        });
      return { index, extractValue, type: numericType, data };
    });
  }

  public async getParamValue<T>(
    value: T,
    {
      metatype,
      type,
      data,
    }: { metatype: unknown; type: RouteParamtypes; data: unknown },
    pipes: PipeTransform[],
  ): Promise<unknown> {

    return value;
  }

  public createGuardsFn<TContext extends string = ContextType>(
    guards: CanActivate[],
    instance: Controller,
    callback: (...args: any[]) => any,
    contextType?: TContext,
  ): (args: any[]) => Promise<void> | null {
    const canActivateFn = async (args: any[]) => {
      const canActivate = await this.guardsConsumer.tryActivate<TContext>(
        guards,
        args,
        instance,
        callback,
        contextType,
      );
      if (!canActivate) {
        throw new ForbiddenException(FORBIDDEN_MESSAGE);
      }
    };
    return guards.length ? canActivateFn : null;
  }

  public createHandleResponseFn(
    callback: (...args: unknown[]) => unknown,
    isResponseHandled: boolean,
    redirectResponse?: RedirectResponse,
    httpStatusCode?: number,
  ): HandleResponseFn {
    const renderTemplate = this.reflectRenderTemplate(callback);
    if (renderTemplate) {
      return async <TResult, TResponse>(result: TResult, res: TResponse) => {
        return await this.responseController.render(
          result,
          res,
          renderTemplate,
        );
      };
    }
    if (redirectResponse && isString(redirectResponse.url)) {
      return async <TResult, TResponse>(result: TResult, res: TResponse) => {
        await this.responseController.redirect(result, res, redirectResponse);
      };
    }

    return async <TResult, TResponse>(result: TResult, res: TResponse) => {
      result = await this.responseController.transformToResult(result);
      !isResponseHandled &&
        (await this.responseController.apply(result, res, httpStatusCode));
      return res;
    };
  }

  private isResponseHandled(
    instance: Controller,
    methodName: string,
    paramsMetadata: ParamProperties[],
  ): boolean {
    const hasResponseOrNextDecorator = paramsMetadata.some(
      ({ type }) =>
        type === RouteParamtypes.RESPONSE || type === RouteParamtypes.NEXT,
    );
    const isPassthroughEnabled = this.contextUtils.reflectPassthrough(
      instance,
      methodName,
    );
    return hasResponseOrNextDecorator && !isPassthroughEnabled;
  }
}
