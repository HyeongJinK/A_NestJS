const target = {
  message: "Hello, world!",
};

const handler = {
  get: (target, property) => {
    console.log(`Accessing property: ${property}`);
    return Reflect.get(target, property);
  },
};

const proxy = new Proxy(target, handler);

console.log(proxy.message);  // "Accessing property: message" 출력 후 "Hello, world!" 반환

// Reflect 객체는 자바스크립트 내장 객체로서, 객체의 속성에 접근하거나 조작하는 표준화된 메서드를 제공합니다