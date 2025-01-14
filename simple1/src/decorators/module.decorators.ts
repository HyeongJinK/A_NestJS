// src/decorators/module.decorator.ts
export function Module(metadata: any): ClassDecorator {
    return (target: Function) => {
        Reflect.defineMetadata('module', metadata, target);
    };
}