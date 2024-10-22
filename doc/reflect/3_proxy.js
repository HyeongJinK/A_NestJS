const target = {
  name: "Alice",
  age: 25,
};

const handler = {
  set: (target, property, value) => {
    if (property === "age" && typeof value !== "number") {
      throw new TypeError("Age must be a number");
    }
    console.log(`Setting property '${property}' to ${value}`);
    return Reflect.set(target, property, value);
  },
};

const proxy = new Proxy(target, handler);

proxy.age = 30;    // 정상적으로 설정됨
console.log(proxy.age);  // 30

try {
  proxy.age = "thirty";  // TypeError 발생
} catch (e) {
  console.error(e.message);  // "Age must be a number"
}
