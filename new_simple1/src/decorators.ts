// decorators.ts
import 'reflect-metadata';

export function Controller(prefix: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata('prefix', prefix, target);
    if (!Reflect.hasMetadata('routes', target)) {
      Reflect.defineMetadata('routes', [], target);
    }
  };
}

export function Get(path: string): MethodDecorator {
  return (target, propertyKey) => {
    const routes = Reflect.getMetadata('routes', target.constructor) || [];
    routes.push({
      method: 'get',
      path,
      handlerName: propertyKey,
    });
    Reflect.defineMetadata('routes', routes, target.constructor);
  };
}
