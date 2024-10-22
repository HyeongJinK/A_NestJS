// 메타데이터 키 정의
const CLASS_META_KEY = Symbol('classMeta');
const METHOD_META_KEY = Symbol('methodMeta');

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
    Reflect.defineMetadata(METHOD_META_KEY, value, target, propertyKey);
    console.log(`MethodDecorator 실행: ${value}`);
  };
}

// 파라미터 데코레이터
function parameterDecorator(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  const classValue = Reflect.getMetadata(CLASS_META_KEY, target); // 클래스의 프로토타입에서 값 가져오기
  const methodValue = Reflect.getMetadata(METHOD_META_KEY, target, propertyKey); // 메서드에서 값 가져오기

  console.log(`ParameterDecorator 실행: 클래스 값 - ${classValue}, 메서드 값 - ${methodValue}, 매개변수 인덱스 - ${parameterIndex}`);
}

// 메타데이터를 사용하기 위해 reflect-metadata를 import해야 합니다.
import 'reflect-metadata';

@classDecorator('클래스 값: ExampleClass')
class ExampleClass {

  @methodDecorator('메서드 값: greet')
  greet(@parameterDecorator name: string) {
    console.log(`Hello, ${name}`);
  }
}

const example = new ExampleClass();
example.greet('Alice');
