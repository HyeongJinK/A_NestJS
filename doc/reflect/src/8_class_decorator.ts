import "reflect-metadata";

function Entity(tableName: string) {
  return function (constructor: Function) {
    Reflect.defineMetadata("table", tableName, constructor);
  };
}

@Entity("users")
class User {
  constructor(public name: string, public age: number) {}
}

const tableName = Reflect.getMetadata("table", User);
console.log(tableName);  // "users"
