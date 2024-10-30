import 'reflect-metadata';

export function Controller(prefix?: string): ClassDecorator {
    const path = prefix ? prefix : '/';

    return (target: object) => {
        Reflect.defineMetadata('path', path, target);
    }
}