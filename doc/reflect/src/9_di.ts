import "reflect-metadata";

class Logger {
  log(message: string) {
    console.log(`Log: ${message}`);
  }
}

function Injectable(target: Function) {
  Reflect.defineMetadata("injectable", true, target);
}

@Injectable
class UserService {
  constructor(public logger: Logger) {}

  createUser() {
    this.logger.log("User created");
  }
}

class Injector {
  static resolve<T>(target: new (...args: any[]) => T): T {
    // 클래스 생성자의 파라미터 타입 가져오기
    const constructorParams: any[] = Reflect.getMetadata("design:paramtypes", target) || [];
    const injections = constructorParams.map((param) => Injector.resolve(param));
    return new target(...injections);
  }
}

// 메타데이터 자동 주입을 위한 설정
Reflect.metadata("design:paramtypes", [Logger])(UserService);

// 의존성 주입 사용
const userService = Injector.resolve(UserService);
userService.createUser();  // "Log: User created"
