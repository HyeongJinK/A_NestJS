// src/decorators/controller.decorator.ts
import 'reflect-metadata';

export function Controller(path: string): ClassDecorator {
    return (target: Function) => {
        Reflect.defineMetadata('path', path, target);
    };
}