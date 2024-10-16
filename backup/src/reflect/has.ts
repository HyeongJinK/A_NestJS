import {data} from "./ex";

console.log(Reflect.has(data, "name"));  // true
console.log(Reflect.has(data, "name2")); // false

