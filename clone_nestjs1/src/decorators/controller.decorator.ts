import 'reflect-metadata';

export function Controller(prefix?: string): ClassDecorator {
    const path = prefix ? prefix : '/';

    return (target: object) => {
        // console.log('target:', target);
        Reflect.defineMetadata('path', path, target);
    }
}