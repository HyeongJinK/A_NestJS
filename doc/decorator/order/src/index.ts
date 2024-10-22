import 'reflect-metadata';

// 메타데이터 키 정의
const CLASS_META_KEY = Symbol('classMeta');
const METHOD_META_KEY = Symbol('methodMeta');
const PARAM_META_KEY = Symbol('paramMeta');

// 클래스 데코레이터
function classDecorator(value: string) {
  return function (constructor: Function) {
    // 클래스의 메타데이터 설정
    Reflect.defineMetadata(CLASS_META_KEY, value, constructor.prototype); // 클래스의 프로토타입에 메타데이터 설정
    console.log(`ClassDecorator 실행: ${value}`);
  };
}

// 메서드 데코레이터
function methodDecorator(value: string) {
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    // 메서드의 메타데이터 설정
    console.log(`MethodDecorator 실행`);
    Reflect.defineMetadata(METHOD_META_KEY, value, target, propertyKey);

    // 원래 메서드를 저장해 둠
    const originalMethod = descriptor.value;

    // 새롭게 메서드를 정의
    descriptor.value = function (...args: any[]) {
      const classValue = Reflect.getMetadata(CLASS_META_KEY, target);
      const methodValue = Reflect.getMetadata(METHOD_META_KEY, target, propertyKey);

      // 파라미터 메타데이터 확인 (파라미터 데코레이터가 저장한 정보 사용)
      const parameterMeta = Reflect.getMetadata(PARAM_META_KEY, target, propertyKey) || [];

      // 각 파라미터에 대해 데코레이터 정보를 처리
      parameterMeta.forEach((meta: any) => {
        const paramIndex = meta.index;
        const paramValue = args[paramIndex];
        const paramDecorValue = meta.decoratorValue;

        console.log(`메서드 실행 중: 클래스 값 - ${classValue}, 메서드 값 - ${methodValue}, 
        파라미터 인덱스 - ${paramIndex}, 파라미터 값 - ${paramValue}, 파라미터 데코레이터 값 - ${paramDecorValue}`);
      });

      // 원래 메서드를 호출
      return originalMethod.apply(this, args);
    };
  };
}
/**
 * 1. 주요 수정 사항:
 * 메서드 데코레이터에서 원래 메서드 오버라이드:
 *
 * 메서드 데코레이터에서 원래 메서드를 originalMethod로 저장한 후, 해당 메서드를 오버라이드합니다. 메서드가 호출될 때 클래스 및 메서드의 메타데이터를 읽고 로그를 출력하도록 설정했습니다.
 * 이 방법으로 파라미터 데코레이터는 메타데이터가 정의되기 전 실행되지만, 실제 메서드 실행 시점에서 메타데이터를 읽을 수 있습니다.
 * 파라미터 데코레이터는 그대로:
 *
 * 파라미터 데코레이터는 여전히 descriptor.value에서 동작하기 때문에 실행 순서와 관계없이 동작합니다.
 * */

// 파라미터 데코레이터
function parameterDecorator(paramValue: string) {
  return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
    // 파라미터 메타데이터에 저장 (파라미터의 인덱스와 데코레이터 값을 함께 저장)
    const existingParams = Reflect.getMetadata(PARAM_META_KEY, target, propertyKey) || [];
    existingParams.push({ index: parameterIndex, decoratorValue: paramValue });
    Reflect.defineMetadata(PARAM_META_KEY, existingParams, target, propertyKey);
    console.log(`ParameterDecorator 실행: 파라미터 인덱스 - ${parameterIndex}, 데코레이터 값 - ${paramValue}`);
  };
}

// 메타데이터를 사용하기 위해 reflect-metadata를 import해야 합니다.
@classDecorator('클래스 값: ExampleClass')
class ExampleClass {

  @methodDecorator('메서드 값: greet')
  greet(@parameterDecorator('파라미터 값: name') name: string) {
    console.log(`Hello, ${name}`);
  }
}

const example = new ExampleClass();
example.greet('Alice');
