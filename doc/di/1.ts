import "reflect-metadata";

type Constructor<T = any> = new (...args: any[]) => T;

class DIContainer {
    private services = new Map<string, Constructor>();

    // 서비스 등록
    register<T>(name: string, constructor: Constructor<T>) {
        this.services.set(name, constructor);
    }

    resolve<T>(name: string): T {
        const constructor = this.services.get(name);
        if (!constructor) {
            throw new Error(`Service ${name} not found`);
        }
        //console.log(`constructor: ${constructor}`);
        // 의존성 주입 처리
        const dependencies = Reflect.getMetadata('design:paramtypes', constructor) || [];
        //console.log(`dependencies: ${dependencies}`);
        const injections = dependencies.map((dep: Constructor) => this.resolve(dep.name));

        return new constructor(...injections);
    }
}

// **데코레이터를 사용하여 DI 설정**
function Injectable(): ClassDecorator {
    return (target: any) => {
        //console.log(`Reflect.getMetadata("design:paramtypes", target): ${Reflect.getMetadata("design:paramtypes", target)}`);
        Reflect.defineMetadata("design:paramtypes", Reflect.getMetadata("design:paramtypes", target), target);
    };
}

// 클래스 예제
// 클래스 선언 순서가 변경되면 위에 Injectable 데코레이터에서 에러 발생
@Injectable()
class DatabaseService {
    connect() {
        console.log("Database connected");
    }
}

@Injectable()
class UserService {
    constructor(private db: DatabaseService) {}

    getUser() {
        this.db.connect();
        return { id: 1, name: "John Doe" };
    }
}

// 컨테이너 초기화 및 서비스 등록
const container = new DIContainer();
container.register("DatabaseService", DatabaseService);
container.register("UserService", UserService);

// 의존성 주입 후 인스턴스 생성
const userService = container.resolve<UserService>("UserService");
console.log(userService.getUser());
