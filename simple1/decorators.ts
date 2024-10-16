const routes = new Map();

// @Controller 데코레이터
export function Controller(prefix: string) {
  return function (target: any) {
    target.prototype.prefix = prefix;
  };
}

// @Get 데코레이터
export function Get(path: string) {
  return function (target: any, key: string) {
    const prefix = target.constructor.prototype.prefix || '';
    routes.set(`${prefix}${path}`, target[key]);
  };
}

export { routes };


// 메타데이터 사용
// import 'reflect-metadata';
// const routes = new Map<string, Function>();

// // @Controller 데코레이터
// export function Controller(prefix: string): ClassDecorator {
//   return function (target: Function) {
//     Reflect.defineMetadata('prefix', prefix, target);
//   };
// }

// // @Get 데코레이터 - 메서드에 대한 데코레이터
// export function Get(path: string): MethodDecorator {
//   return function (
//     target: any,
//     propertyKey: string | symbol,
//     descriptor: PropertyDescriptor
//   ): void {
//     const prefix = Reflect.getMetadata('prefix', target.constructor) || '';
//     const routePath = `${prefix}${path}`;
//     routes.set(routePath, descriptor.value as Function); // 메서드 저장, 타입 단언 추가
//   };
// }

// export { routes };

