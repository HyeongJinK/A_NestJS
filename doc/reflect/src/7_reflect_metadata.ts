import "reflect-metadata";
// 메타데이터를 설정하는 데코레이터
function Role(role: string) {
  return function (target: Object, propertyKey: string | symbol) {
    Reflect.defineMetadata("role", role, target, propertyKey);
  };
}

class User {
  @Role("admin")
  performAdminTask() {
    console.log("Admin task performed");
  }
}

const user = new User();
const role = Reflect.getMetadata("role", user, "performAdminTask");
console.log(role);  // "admin"
