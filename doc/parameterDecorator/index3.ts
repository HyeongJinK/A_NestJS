import 'reflect-metadata';

function Required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  const existingRequiredParameters: number[] = Reflect.getOwnMetadata('required', target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata('required', existingRequiredParameters, target, propertyKey);
}

function validate(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const requiredParameters: number[] = Reflect.getOwnMetadata('required', target, propertyKey) || [];

    for (const parameterIndex of requiredParameters) {
      if (args[parameterIndex] === undefined || args[parameterIndex] === null) {
        throw new Error(`메서드 ${String(propertyKey)}의 매개변수 ${parameterIndex}는 필수입니다.`);
      }
    }

    return method.apply(this, args);
  };
}

class UserService {
  @validate
  createUser(@Required name: string, @Required age: number | undefined) {
    console.log(`User created: ${name}, Age: ${age}`);
  }
}

const userService = new UserService();
userService.createUser('Alice', 30);  // 정상 실행: User created: Alice, Age: 30
userService.createUser('Alice', undefined); // 오류 발생: 메서드 createUser의 매개변수 1는 필수입니다.
