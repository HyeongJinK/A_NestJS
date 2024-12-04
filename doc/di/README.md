## 3. 의존성 주입

의존성 주입(DI)은 객체 간의 의존성을 프레임워크 또는 컨테이너가 관리하도록 위임하여 코드의 결합도를 낮추고 유지보수를 쉽게 하는 패턴입니다. 이 카테고리는 DI의 이론부터 실제 구현 방법까지 상세히 다룹니다.

---


#### **3.1 DI의 원리와 필요성**

**DI의 원리**

- 객체가 직접 다른 객체를 생성하거나 의존성을 관리하지 않고, 외부에서 주입받는 방식입니다.
- 주입 방식:
    - 생성자 주입 (Constructor Injection)
    - 메서드 주입 (Method Injection)
    - 속성 주입 (Property Injection)

**필요성**

1. **결합도 감소**
    - 객체가 다른 객체를 직접 생성하면 결합도가 높아지지만, DI를 사용하면 이를 낮출 수 있습니다.
2. **테스트 용이성**
    - 모의 객체(Mock)를 주입할 수 있어 테스트가 간단해집니다.
3. **유지보수성과 확장성 향상**
    - 의존성 관리가 중앙 집중화되므로 변경이 용이합니다.

---

#### **3.2 간단한 DI 컨테이너 설계**

**목표**

- 클래스를 등록하고 의존성을 주입할 수 있는 간단한 DI 컨테이너를 구현합니다.

```shell
npm i typescript --save-dev
npm i reflect-metadata
```

**코드: DI 컨테이너 설계**

```typescript
type Constructor<T = any> = new (...args: any[]) => T;

class DIContainer {
  private services = new Map<string, Constructor>();

  // 서비스 등록
  register<T>(name: string, constructor: Constructor<T>) {
    this.services.set(name, constructor);
  }

  // 의존성 주입 후 인스턴스 생성
  resolve<T>(name: string): T {
    const constructor = this.services.get(name);
    if (!constructor) {
      throw new Error(`Service ${name} not found`);
    }

    // 의존성 주입 처리
    const dependencies = Reflect.getMetadata('design:paramtypes', constructor) || [];
    const injections = dependencies.map((dep: Constructor) => this.resolve(dep.name));

    return new constructor(...injections);
  }
}
```

**사용 예제**

1. 의존성 메타데이터 설정 (TypeScript의 `reflect-metadata` 활용)

```typescript
import "reflect-metadata";

class DatabaseService {
  connect() {
    console.log('Database connected');
  }
}

class UserService {
  constructor(private db: DatabaseService) {}

  getUser() {
    this.db.connect();
    return { id: 1, name: 'John Doe' };
  }
}

// 컨테이너 초기화 및 서비스 등록
const container = new DIContainer();
container.register('DatabaseService', DatabaseService);
container.register('UserService', UserService);

// 의존성 주입 후 UserService 인스턴스 생성
const userService = container.resolve<UserService>('UserService');
console.log(userService.getUser());
```

**출력**

```
Database connected
{ id: 1, name: 'John Doe' }
```

---

#### **3.3 서비스 등록 및 의존성 주입 메커니즘 구현**

의존성 주입의 핵심은 클래스 간 의존성을 컨테이너가 관리하도록 만드는 것입니다.

**서비스 등록 방법**

1. 컨테이너에 서비스와 이름 매핑
2. 생성자에서 필요한 의존성 요청

**업데이트된 DIContainer**

```typescript
class DIContainer {
  private instances = new Map<string, any>();

  register<T>(name: string, constructor: Constructor<T>) {
    if (this.instances.has(name)) {
      throw new Error(`Service ${name} is already registered`);
    }
    this.instances.set(name, { constructor, instance: null });
  }

  resolve<T>(name: string): T {
    const entry = this.instances.get(name);
    if (!entry) {
      throw new Error(`Service ${name} not found`);
    }

    if (!entry.instance) {
      const { constructor } = entry;
      const dependencies = Reflect.getMetadata('design:paramtypes', constructor) || [];
      const injections = dependencies.map((dep: Constructor) => this.resolve(dep.name));
      entry.instance = new constructor(...injections); // Lazy Instantiation
    }

    return entry.instance;
  }
}
```

**테스트**

```typescript
const userService = container.resolve<UserService>('UserService');
const userService2 = container.resolve<UserService>('UserService');

console.log(userService === userService2); // true (싱글턴 관리)
```

---

#### **3.4 싱글턴 및 스코프 관리**

**싱글턴 관리**

- 동일한 클래스의 인스턴스는 하나만 생성되도록 관리합니다.
- 위의 코드에서 이미 싱글턴 관리가 구현되었습니다.

**스코프 관리 추가**

- 요청 스코프(Request Scope): 요청마다 새로운 인스턴스 생성
- 전역 스코프(Singleton Scope): 애플리케이션 전체에서 단일 인스턴스 유지

**스코프 구분 구현**

```typescript
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
```

**테스트**

```typescript
const requestScope = new Map();

container.register('DatabaseService', DatabaseService, 'singleton');
container.register('UserService', UserService, 'request');

const userService1 = container.resolve<UserService>('UserService', requestScope);
const userService2 = container.resolve<UserService>('UserService', requestScope);

console.log(userService1 === userService2); // true (같은 요청 스코프)
```

---

### **결론**

- **DI의 원리**: 의존성을 외부로부터 주입받아 결합도를 낮춤.
- **DI 컨테이너**: 서비스를 등록하고 의존성을 관리하는 중심 역할.
- **싱글턴 및 스코프 관리**: 인스턴스의 생명주기를 컨테이너가 관리하여 효율성 극대화.

이 구현을 기반으로 더 복잡한 기능을 추가하며 프레임워크를 확장할 수 있습니다.