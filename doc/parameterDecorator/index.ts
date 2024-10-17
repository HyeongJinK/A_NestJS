function Param(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  console.log(`ParameterDecorator - 클래스: ${target.constructor.name}, 
    메서드: ${String(propertyKey)}, 
    매개변수 인덱스: ${parameterIndex}`);
}

class ExampleClass {
  test(@Param name: string) {
    console.log(`Hello, ${name}!`);
  }
}

const example = new ExampleClass();
example.test('World');

/**
  target: 데코레이터가 적용된 메서드를 포함한 클래스의 프로토타입 객체입니다.
  propertyKey: 데코레이터가 적용된 메서드의 이름입니다.
  parameterIndex: 데코레이터가 적용된 매개변수의 인덱스입니다.
 */