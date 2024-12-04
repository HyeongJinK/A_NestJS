/**
 * 스코프 관리란 DI 컨테이너에서 객체의 생성과 라이프사이클을 제어하는 방식.
 * 주로 사용되는 스코프
 *
 * 싱글턴(Singleton): 애플리케이션 전역에서 하나의 인스턴스만 생성.
 * 요청(Request): 요청마다 새로운 인스턴스 생성.
 * 임시(Transient): 매번 새로운 인스턴스 생성.
 * 아래는 스코프를 지원하도록 개선된 DI 컨테이너와 이를 테스트하기 위한 보강된 코드를 제공합니다.
 * */
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

type Scope = 'singleton' | 'request';

interface ServiceEntry<T> {
    constructor: Constructor<T>;
    instance: T | null;
    scope: Scope;
}

class ScopedDIContainer {
    private instances = new Map<string, ServiceEntry<any>>();

    register<T>(name: string, constructor: Constructor<T>, scope: Scope = 'singleton') {
        this.instances.set(name, { constructor, instance: null, scope });
    }

    resolve<T>(name: string, requestScope: Map<string, any> = new Map()): T {
        const entry = this.instances.get(name);
        if (!entry) {
            throw new Error(`Service ${name} not found`);
        }

        if (entry.scope === 'singleton') {
            if (!entry.instance) {
                entry.instance = new entry.constructor();
            }
            return entry.instance;
        }

        if (entry.scope === 'request') {
            if (!requestScope.has(name)) {
                requestScope.set(name, new entry.constructor());
            }
            return requestScope.get(name);
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

const container = new ScopedDIContainer();
const requestScope = new Map();

container.register('DatabaseService', DatabaseService, 'singleton');
container.register('UserService', UserService, 'request');

const userService1 = container.resolve<UserService>('UserService', requestScope);
const userService2 = container.resolve<UserService>('UserService', requestScope);

console.log(userService1 === userService2); // true (같은 요청 스코프)