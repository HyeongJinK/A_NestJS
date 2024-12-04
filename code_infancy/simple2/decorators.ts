import 'reflect-metadata'; // Reflect 메타데이터 사용을 위해 추가
import { extractPathParams } from './utils';

type RouteDefinition = {
    method: string;
    handler: Function;
    params?: string[];
    isDynamic: boolean;
};

const routes: Map<string, RouteDefinition[]> = new Map();

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
        const prefix = Reflect.getMetadata('prefix', target.constructor);
        console.log('prefix:', prefix);
        if (!prefix) {
            throw new Error(`Prefix not defined for ${target.constructor.name}`);
        }

        const routePath = `${prefix}${path}`;
        const paramNames = routePath.match(/:[^\/]+/g)?.map(p => p.substring(1)) || [];
        const routeDefinition: RouteDefinition = {
            method: 'GET',
            handler: descriptor.value as Function,
            params: paramNames,
            isDynamic: paramNames.length > 0,
        };

        if (!routes.has(routePath)) {
            routes.set(routePath, [routeDefinition]);
        } else {
            routes.get(routePath)?.push(routeDefinition);
        }
    };
}

// @Param 데코레이터 - 메서드 파라미터를 위한 데코레이터
export function Param(paramName: string): ParameterDecorator {
    return function (target: Object, propertyKey: string | symbol| undefined, parameterIndex: number): void {
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
    let staticRoutes: [string, RouteDefinition[]][] = [];
    let dynamicRoutes: [string, RouteDefinition[]][] = [];

    for (const [routePath, routeDefinitions] of routes.entries()) {
        if (routeDefinitions.some(rd => rd.isDynamic)) {
            dynamicRoutes.push([routePath, routeDefinitions]);
        } else {
            staticRoutes.push([routePath, routeDefinitions]);
        }
    }

    const allRoutes = [...staticRoutes, ...dynamicRoutes];

    for (const [routePath, routeDefinitions] of allRoutes) {
        const pathParams = extractPathParams(routePath, reqUrl);

        if (pathParams) {
            const routeDefinition = routeDefinitions.find(rd => rd.method === method);
            if (routeDefinition) {
                return { handler: routeDefinition.handler, pathParams, params: routeDefinition.params };
            }
        }
    }

    return null;
}

export { routes };
