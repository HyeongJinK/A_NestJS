import "reflect-metadata";

type Constructor<T = any> = new (...args: any[]) => T;

class DIContainer {
    private instances = new Map<string, any>();

    register<T>(name: string, constructor: Constructor<T>) {
        if (this.instances.has(name)) { // 이미 등록된 인스턴스 인지 검사
            throw new Error(`Service ${name} is already registered`);
        }
        this.instances.set(name, { constructor, instance: null });
    }

    resolve<T>(name: string): T {
        const entry = this.instances.get(name);
        if (!entry) {
            throw new Error(`Service ${name} not found`);
        }

        if (!entry.instance) {  // 만들어진 인스턴스가 없을 경우
            const { constructor } = entry;
            const dependencies = Reflect.getMetadata('design:paramtypes', constructor) || [];
            const injections = dependencies.map((dep: Constructor) => this.resolve(dep.name));
            entry.instance = new constructor(...injections); // Lazy Instantiation
        }

        return entry.instance;
    }
}

// **데코레이터를 사용하여 DI 설정**
function Injectable(): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata("design:paramtypes", Reflect.getMetadata("design:paramtypes", target), target);
    };
}

// 클래스 예제
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

const container = new DIContainer();
container.register("DatabaseService", DatabaseService);
container.register("UserService", UserService);

const userService = container.resolve<UserService>('UserService');
const userService2 = container.resolve<UserService>('UserService');

console.log(userService === userService2); // true (싱글턴 관리)