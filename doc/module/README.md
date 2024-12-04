4. 모듈시스템 설계

모듈 시스템은 대규모 애플리케이션을 구성하는 핵심 설계 요소로, 코드의 구조화와 재사용성을 극대화합니다. 이 섹션에서는 모듈의 개념과 설계, 구현 방식을 단계적으로 설명합니다.

---

#### **4.1 모듈이란 무엇인가?**

**모듈의 정의**

- 모듈은 관련된 기능을 하나로 묶은 코드의 단위입니다.
- 모듈은 다른 모듈과 독립적으로 동작하며, 필요한 경우 의존성을 통해 서로 연결됩니다.

**모듈의 주요 특징**

1. **분리와 캡슐화**
    - 기능별로 코드를 분리하여 독립성과 가독성을 높임.
2. **재사용성**
    - 한 번 정의된 모듈을 다른 프로젝트나 기능에서 재사용 가능.
3. **의존성 관리**
    - 다른 모듈과의 상호작용을 명확하게 정의하여 의존성 문제를 최소화.

**예시: 사용자 관리와 인증 모듈**

- `UserModule`: 사용자 정보 관리
- `AuthModule`: 로그인 및 권한 관리

---

#### **4.2 모듈 로딩 및 의존성 관리**

**모듈 등록 및 의존성 관리 구현**

1. **모듈 컨테이너 설계**
    - 모듈을 등록하고, 필요한 경우 의존성을 연결합니다.

**코드: 간단한 모듈 컨테이너**

```typescript
class ModuleContainer {
  private modules = new Map<string, any>();

  // 모듈 등록
  register(moduleName: string, moduleInstance: any) {
    if (this.modules.has(moduleName)) {
      throw new Error(`Module ${moduleName} is already registered.`);
    }
    this.modules.set(moduleName, moduleInstance);
  }

  // 모듈 로딩
  get(moduleName: string): any {
    const module = this.modules.get(moduleName);
    if (!module) {
      throw new Error(`Module ${moduleName} not found.`);
    }
    return module;
  }
}
```

2. **사용 예제**

```typescript
class UserService {
  getUser() {
    return { id: 1, name: 'John Doe' };
  }
}

class UserModule {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getService() {
    return this.userService;
  }
}

// 모듈 컨테이너 초기화 및 모듈 등록
const container = new ModuleContainer();
container.register('UserModule', new UserModule());

// 모듈 로딩 및 의존성 관리
const userModule = container.get('UserModule') as UserModule;
console.log(userModule.getService().getUser());
```

**출력**

```
{ id: 1, name: 'John Doe' }
```

---

#### **4.3 모듈 간 통신 및 경량화**

모듈 간 통신은 독립된 모듈이 데이터를 교환하거나 특정 기능을 호출할 수 있도록 설계되어야 합니다.

**방법: 모듈 간 메시지 전달**

1. **이벤트 기반 통신**

**코드: 이벤트 기반 통신**

```typescript
class EventBus {
  private listeners = new Map<string, Function[]>();

  // 이벤트 등록
  on(event: string, listener: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  // 이벤트 발생
  emit(event: string, payload: any) {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach((listener) => listener(payload));
  }
}

// 모듈 A
class UserModule {
  constructor(private eventBus: EventBus) {}

  createUser(user: { id: number; name: string }) {
    console.log('User created:', user);
    this.eventBus.emit('userCreated', user);
  }
}

// 모듈 B
class NotificationModule {
  constructor(private eventBus: EventBus) {
    this.eventBus.on('userCreated', (user) => this.notify(user));
  }

  notify(user: any) {
    console.log('Notification sent for user:', user.name);
  }
}

// 이벤트 버스 생성 및 모듈 초기화
const eventBus = new EventBus();
const userModule = new UserModule(eventBus);
const notificationModule = new NotificationModule(eventBus);

// 사용자 생성 및 이벤트 발생
userModule.createUser({ id: 1, name: 'John Doe' });
```

**출력**

```
User created: { id: 1, name: 'John Doe' }
Notification sent for user: John Doe
```

2. **서비스 간 직접 호출 (Dependency Injection 활용)**

```typescript
class UserService {
  getUser() {
    return { id: 1, name: 'John Doe' };
  }
}

class AuthService {
  constructor(private userService: UserService) {}

  authenticate(userId: number) {
    const user = this.userService.getUser();
    return user.id === userId ? 'Authenticated' : 'Not Authenticated';
  }
}

const userService = new UserService();
const authService = new AuthService(userService);

console.log(authService.authenticate(1)); // Authenticated
```

---

#### **4.4 모듈 동적 로딩 구현**

동적 로딩은 애플리케이션 실행 중 필요한 모듈만 로딩하여 메모리 사용량을 줄이고 성능을 최적화하는 데 사용됩니다.

**코드: 동적 모듈 로딩**

```typescript
class DynamicModuleContainer {
  private modules = new Map<string, () => any>();

  // 모듈 등록
  register(moduleName: string, loader: () => any) {
    this.modules.set(moduleName, loader);
  }

  // 동적 로딩
  async load(moduleName: string) {
    const loader = this.modules.get(moduleName);
    if (!loader) {
      throw new Error(`Module ${moduleName} not registered.`);
    }
    return loader();
  }
}

// 동적 로딩 예제
const dynamicContainer = new DynamicModuleContainer();

// 모듈 등록
dynamicContainer.register('LazyModule', async () => {
  const module = { name: 'Lazy Loaded Module' };
  console.log('Module Loaded:', module.name);
  return module;
});

// 동적 로딩
(async () => {
  const lazyModule = await dynamicContainer.load('LazyModule');
  console.log('Using Module:', lazyModule.name);
})();
```

**출력**

```
Module Loaded: Lazy Loaded Module
Using Module: Lazy Loaded Module
```

---

### **요약**

1. **모듈**은 코드의 독립적 단위로 분리와 재사용성을 제공합니다.
2. **모듈 로딩**은 DI 컨테이너를 통해 효율적으로 관리됩니다.
3. **모듈 간 통신**은 이벤트 기반 또는 DI를 통해 이루어지며, 의존성을 명확히 관리합니다.
4. **동적 로딩**은 런타임에 필요한 모듈만 로드하여 성능을 최적화합니다.

이 구현은 실질적인 프레임워크 설계의 기본 구조를 제공합니다. 이후 단계에서는 더 복잡한 모듈 간 의존성과 플러그인 시스템을 설계할 수 있습니다.
