```ts
export function Controller(): ClassDecorator;
export function Controller(prefix: string | string[]): ClassDecorator;
export function Controller(options: ControllerOptions): ClassDecorator;
```

```ts
export function Controller(
    prefixOrOptions?: string | string[] | ControllerOptions,
): ClassDecorator {
    const defaultPath = '/';

    const [path, host, scopeOptions, versionOptions] = isUndefined(
        prefixOrOptions,
    )
        ? [defaultPath, undefined, undefined, undefined]
        : isString(prefixOrOptions) || Array.isArray(prefixOrOptions)
            ? [prefixOrOptions, undefined, undefined, undefined]
            : [
                prefixOrOptions.path || defaultPath,
                prefixOrOptions.host,
                { scope: prefixOrOptions.scope, durable: prefixOrOptions.durable },
                Array.isArray(prefixOrOptions.version)
                    ? Array.from(new Set(prefixOrOptions.version))
                    : prefixOrOptions.version,
            ];

    return (target: object) => {
        Reflect.defineMetadata(CONTROLLER_WATERMARK, true, target);
        Reflect.defineMetadata(PATH_METADATA, path, target);
        Reflect.defineMetadata(HOST_METADATA, host, target);
        Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, scopeOptions, target);
        Reflect.defineMetadata(VERSION_METADATA, versionOptions, target);
    };
}
```

```ts
export const GLOBAL_MODULE_METADATA = '__module:global__';
export const HOST_METADATA = 'host';
export const PATH_METADATA = 'path';
export const SCOPE_OPTIONS_METADATA = 'scope:options';
export const VERSION_METADATA = '__version__'
```

* prefixOrOptions
* Path 접두어 또는 옵션: string | string[] | ControllerOptions

```ts
// @see [Routing](https://docs.nestjs.com/controllers#routing)
export interface ControllerOptions extends ScopeOptions, VersionOptions {
    path?: string | string[];
    host?: string | RegExp | Array<string | RegExp>;
}
// @see [Injection Scopes](https://docs.nestjs.com/fundamentals/injection-scopes)
export enum Scope {
    DEFAULT,        // 하나의 단일 인스턴스(싱글톤)를 만들고 전체 애플리케이션에서 공유
    TRANSIENT,      // 임시 공급자???
    REQUEST,        // 매번 요청할 때마다 새로운 인스턴스를 만듬 
}
export interface ScopeOptions {
    scope?: Scope;
    durable?: boolean;
}
// @see [Versioning](https://docs.nestjs.com/techniques/versioning)
export interface VersionOptions {
    version?: VersionValue;
}
```

Injection scopes는 주로 의존성 주입(Dependency Injection) 컨테이너에서 사용되며, 서비스의 인스턴스를 생성하고 관리하는 방식을 지정합니다. 주요한 세 가지 injection scopes는 다음과 같습니다:

1. Singleton: Singleton scope는 애플리케이션 전체에서 하나의 인스턴스를 공유합니다. 즉, 같은 인스턴스가 여러 번 요청되어도 항상 동일한 인스턴스가 반환됩니다. 이는 리소스 절약 및 상태의 일관성을 유지하는 데 도움이 됩니다. 주로 애플리케이션의 상태를 유지하거나 공유해야 하는 서비스에 사용됩니다.
2. Transient: Transient scope는 매번 새로운 인스턴스를 생성하여 반환합니다. 각 요청마다 새로운 인스턴스를 생성하기 때문에 상태를 공유하지 않습니다. 이것은 각 요청이 독립적으로 처리되어야 하는 경우에 유용합니다.
3. Request-scoped: Request-scoped scope는 요청 당 하나의 인스턴스를 생성하고, 해당 요청의 수명 동안 유지됩니다. 다른 요청에서는 새로운 인스턴스가 생성됩니다. 주로 웹 애플리케이션에서 HTTP 요청마다 서비스의 인스턴스를 공유해야 하는 경우에 사용됩니다.

Injection scopes를 올바르게 사용하면 메모리 및 리소스 사용을 최적화하고 상태의 일관성을 유지할 수 있습니다. NestJS와 같은 프레임워크에서는 이러한 injection scopes를 사용하여 서비스의 동작을 조정하고 성능을 최적화할 수 있습니다.

