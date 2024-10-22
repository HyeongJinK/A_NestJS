require("reflect-metadata");
/**
 * TypeScript나 JavaScript에서 메타데이터를 추가하고 관리하는 데 사용할 수 있는 라이브러리로,
 * 주로 데코레이터와 함께 사용되어 객체나 클래스의 메타데이터를 저장하고 참조하는 데 유용합니다.
 * 이 라이브러리는 주로 TypeScript에서 데코레이터 기능을 강화하거나 프레임워크에서 종종 사용됩니다.
 * */
class Example {
  greeting() {
    console.log("Hello, world!");
  }
}

Reflect.defineMetadata("role", "admin", Example.prototype, "greeting");
console.log("1========================")
const role = Reflect.getMetadata("role", Example.prototype, "greeting");
console.log(role); // "admin"
console.log("2========================")
const example = new Example();
example.greeting();
console.log("3========================")
Reflect.defineMetadata("role", "admin", example, "greeting");
const ddd = Reflect.getMetadata("role", example, "greeting");
console.log(ddd)
example.greeting()