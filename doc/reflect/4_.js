const user = {
  username: "john_doe",
  age: 28,
};

const validatorHandler = {
  get: (target, property) => {
    console.log(`Property '${property}' was accessed`);
    return Reflect.get(target, property);
  },
  set: (target, property, value) => {
    if (property === "age" && (typeof value !== "number" || value < 0)) {
      throw new Error("Invalid value for age: must be a non-negative number");
    }
    console.log(`Property '${property}' was set to '${value}'`);
    return Reflect.set(target, property, value);
  },
};

const validatedUser = new Proxy(user, validatorHandler);

console.log(validatedUser.username);  // "Property 'username' was accessed", "john_doe"

validatedUser.age = 30;               // "Property 'age' was set to '30'"
console.log(validatedUser.age);       // "Property 'age' was accessed", 30

try {
  validatedUser.age = -5;            // Error: Invalid value for age
} catch (e) {
  console.error(e.message);
}
