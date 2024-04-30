```ts
// @see [Routing](https://docs.nestjs.com/controllers#routing)
export interface ControllerOptions extends ScopeOptions, VersionOptions {
    path?: string | string[];
    host?: string | RegExp | Array<string | RegExp>;
}
// @see [Injection Scopes](https://docs.nestjs.com/fundamentals/injection-scopes)
export enum Scope {
    DEFAULT,
    TRANSIENT,
    REQUEST,
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
export const VERSION_METADATA = '__version__';
```