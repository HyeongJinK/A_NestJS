import 'reflect-metadata';
import { extractPathParams } from './utils';

const routes = new Map<string, { handler: Function, params?: string[] }>();

// @Controller 데코레이터
export function Controller(prefix: string): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata('prefix', prefix, target);
  };
}

// @Get 데코레이터 - 메서드에 대한 데코레이터
export function Get(path: string): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): void {
    const prefix = Reflect.getMetadata('prefix', target.constructor) || '';
    const routePath = `${prefix}${path}`;
    const paramNames = routePath.match(/:[^\/]+/g)?.map(p => p.substring(1)) || [];
    routes.set(routePath, { handler: descriptor.value as Function, params: paramNames });
  };
}

// @Param 데코레이터
export function Param(paramName: string): ParameterDecorator {
  return function (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
    if (propertyKey === undefined) {
      throw new Error('propertyKey cannot be undefined');
    }
    const existingParams: { [key: string]: number } = Reflect.getOwnMetadata('params', target, propertyKey) || {};
    existingParams[paramName] = parameterIndex;
    Reflect.defineMetadata('params', existingParams, target, propertyKey);
  };
}

// 요청 URL을 기준으로 라우트를 찾고 처리
export function handleRequest(reqUrl: string, method: string) {
  for (const [routePath, { handler, params }] of routes.entries()) {
    const pathParams = extractPathParams(routePath, reqUrl);

    if (pathParams) {
      return { handler, pathParams, params };
    }
  }

  return null;
}

export { routes };