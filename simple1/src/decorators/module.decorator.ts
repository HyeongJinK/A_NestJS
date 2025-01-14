// src/decorators/module.decorator.ts
import 'reflect-metadata';

export interface ModuleMetadata {
    controllers?: any[];
    providers?: any[];
    imports?: any[];
    exports?: any[];
}

export function Module(metadata: ModuleMetadata): ClassDecorator {
    return (target: Function) => {
        Reflect.defineMetadata('module', metadata, target);
    };
}