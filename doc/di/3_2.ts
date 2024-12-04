import "reflect-metadata";

type Constructor<T = any> = new (...args: any[]) => T;

enum Scope {
    Singleton = "singleton",    // 전역적으로 사용
    Transient = "transient",    // 항상 새로운 인스턴스 생성
    Request = "request",        // 요청마다 새로운 인스턴스 생성
}

interface ServiceOptions {
    scope: Scope;
}

class DIContainer {
    private services = new Map<string, { constructor: Constructor; scope: Scope }>();
    private singletons = new Map<string, any>();

    // 서비스 등록
    register<T>(name: string, constructor: Constructor<T>, options: ServiceOptions = { scope: Scope.Singleton }) {
        if (this.services.has(name)) {
            throw new Error(`Service ${name} is already registered`);
        }
        this.services.set(name, { constructor, scope: options.scope });
    }

    // 의존성 주입 후 인스턴스 생성
    resolve<T>(name: string, requestScope: Map<string, any> = new Map()): T {
        const service = this.services.get(name);
        if (!service) {
            throw new Error(`Service ${name} not found`);
        }

        const { constructor, scope } = service;

        // Singleton 스코프 처리
        if (scope === Scope.Singleton) {
            if (!this.singletons.has(name)) {
                const dependencies = Reflect.getMetadata("design:paramtypes", constructor) || [];
                const injections = dependencies.map((dep: Constructor) => this.resolve(dep.name, requestScope));
                const instance = new constructor(...injections);
                this.singletons.set(name, instance);
            }
            return this.singletons.get(name);
        }

        // Request 스코프 처리
        if (scope === Scope.Request) {
            if (!requestScope.has(name)) {
                const dependencies = Reflect.getMetadata("design:paramtypes", constructor) || [];
                const injections = dependencies.map((dep: Constructor) => this.resolve(dep.name, requestScope));
                const instance = new constructor(...injections);
                requestScope.set(name, instance);
            }
            return requestScope.get(name);
        }

        // Transient 스코프 처리
        if (scope === Scope.Transient) {
            const dependencies = Reflect.getMetadata("design:paramtypes", constructor) || [];
            const injections = dependencies.map((dep: Constructor) => this.resolve(dep.name, requestScope));
            return new constructor(...injections);
        }

        throw new Error(`Unknown scope for service ${name}`);
    }
}

// **데코레이터를 사용하여 DI 설정**
function Injectable(): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata("design:paramtypes", Reflect.getMetadata("design:paramtypes", target), target);
    };
}

// **클래스 예제**
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

@Injectable()
class RequestScopedService {
    constructor() {
        console.log("RequestScopedService created");
    }
}

const container = new DIContainer();
container.register("DatabaseService", DatabaseService, { scope: Scope.Singleton });

const dbService1 = container.resolve<DatabaseService>("DatabaseService");
const dbService2 = container.resolve<DatabaseService>("DatabaseService");

console.log(dbService1 === dbService2); // true


container.register("RequestScopedService", RequestScopedService, { scope: Scope.Request });

const requestScope1 = new Map();
const requestScope2 = new Map();

const service1 = container.resolve<RequestScopedService>("RequestScopedService", requestScope1);
const service2 = container.resolve<RequestScopedService>("RequestScopedService", requestScope1);
const service3 = container.resolve<RequestScopedService>("RequestScopedService", requestScope2);

console.log(service1 === service2); // true (same request scope)
console.log(service1 === service3); // false (different request scope)


container.register("UserService", UserService, { scope: Scope.Transient });

const transientService1 = container.resolve<UserService>("UserService");
const transientService2 = container.resolve<UserService>("UserService");

console.log(transientService1 === transientService2); // false
