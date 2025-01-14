// src/decorators/request.decorator.ts
export function Get(path: string = ''): MethodDecorator {
    return (target, propertyKey, descriptor) => {
        Reflect.defineMetadata('method', 'GET', descriptor.value);
        Reflect.defineMetadata('path', path, descriptor.value);
    };
}