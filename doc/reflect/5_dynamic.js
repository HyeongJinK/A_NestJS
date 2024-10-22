const methodHandler = {
  get: (target, property) => {
    if (!(property in target)) {
      return (...args) => {
        console.log(`Method '${property}' is dynamically created with arguments:`, args);
        return `Result of ${property}`;
      };
    }
    return Reflect.get(target, property);
  },
};

const dynamicMethods = new Proxy({}, methodHandler);

console.log(dynamicMethods.sayHello("Alice"));  // "Method 'sayHello' is dynamically created with arguments: ['Alice']"
