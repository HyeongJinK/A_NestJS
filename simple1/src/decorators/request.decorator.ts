// src/decorators/request.decorator.ts
import 'reflect-metadata';

// src/decorators/request.decorator.ts

export function Get(path: string = ''): MethodDecorator {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void => {
        if (!descriptor || typeof descriptor.value !== 'function') {
            throw new Error('Decorator can only be applied to methods');
        }

        Reflect.defineMetadata('method', 'GET', descriptor.value);
        Reflect.defineMetadata('path', path, descriptor.value);
    };
}

export function Post(path: string = ''): MethodDecorator {
    return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void => {
        if (!descriptor || typeof descriptor.value !== 'function') {
            throw new Error('Decorator can only be applied to methods');
        }

        Reflect.defineMetadata('method', 'POST', descriptor.value);
        Reflect.defineMetadata('path', path, descriptor.value);
    };
}

