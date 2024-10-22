const target = {
  message: "Hello, world!",
};

const handler = {
  get: (target, property) => {
    if (property in target) {
      return target[property];
    } else {
      return `Property '${property}' does not exist.`;
    }
  },
};

const proxy = new Proxy(target, handler);

console.log(proxy.message);      // "Hello, world!"
console.log(proxy.nonExistent);  // "Property 'nonExistent' does not exist."

/*
* Proxy: Proxy 객체는 다른 객체를 감싸서 해당 객체의 기본 동작(접근, 설정, 호출 등)을 가로채서 원하는 방식으로 처리할 수 있게 합니다.
* */