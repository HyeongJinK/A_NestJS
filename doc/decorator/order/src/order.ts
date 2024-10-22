// 1. 파라미터 데코레이터
function parameterDecorator(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  console.log('ParameterDecorator 실행: ', propertyKey, '에서 매개변수 인덱스', parameterIndex);
}

// 2. 메서드 데코레이터
function methodDecorator(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
  console.log('MethodDecorator 실행: ', propertyKey);
}

// 3. 프로퍼티 데코레이터
function propertyDecorator(target: Object, propertyKey: string | symbol) {
  console.log('PropertyDecorator 실행: ', propertyKey);
}

// 4. 클래스 데코레이터
function classDecorator(constructor: Function) {
  console.log('ClassDecorator 실행: ', constructor.name);
}

@classDecorator
class ExampleClass {
  @propertyDecorator
  myProperty: string = 'Hello';

  @methodDecorator
  greet(@parameterDecorator name: string): void {
    console.log(`Hello, ${name}`);
  }
}

const example = new ExampleClass();
example.greet('Alice');
