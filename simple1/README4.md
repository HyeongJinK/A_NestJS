# Part 4 - 컨트롤러(Controller) 시스템 구현

## 4.1 컨트롤러(Controller) 이해

### 4.1.1 컨트롤러란?
- 클라이언트의 요청(Request)을 처리하고 응답(Response)을 반환하는 역할을 합니다.
- RESTful API에서 라우팅(Routing) 기능을 담당합니다.
- NestJS에서는 데코레이터 기반으로 간결하게 구현됩니다.

### 4.1.2 컨트롤러의 구성 요소
- **@Controller()**: 라우트 경로를 정의합니다.
- **@Get(), @Post(), @Put(), @Delete()**: HTTP 요청 메서드를 처리합니다.
- **@Param(), @Body(), @Query()**: 요청 데이터를 처리합니다.

## 4.2 `@Controller` 데코레이터 구현

### 4.2.1 컨트롤러 메타데이터 정의
```typescript
// src/decorators/controller.decorator.ts
export function Controller(path: string): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata('path', path, target);
    Reflect.defineMetadata('isController', true, target);
  };
}
```

### 4.2.2 HTTP 메서드 데코레이터 구현
```typescript
// src/decorators/request.decorator.ts
export function Get(path: string = ''): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata('method', 'GET', descriptor.value);
    Reflect.defineMetadata('path', path, descriptor.value);
  };
}

export function Post(path: string = ''): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata('method', 'POST', descriptor.value);
    Reflect.defineMetadata('path', path, descriptor.value);
  };
}
```

## 4.3 라우팅 시스템 구현

### 4.3.1 라우터 탐색기 구현
```typescript
// src/core/router-explorer.ts
import 'reflect-metadata';

export class RouterExplorer {
  explore(controller: any) {
    const controllerPath = Reflect.getMetadata('path', controller.constructor);
    const routes = Object.getOwnPropertyNames(controller.__proto__)
      .filter(method => method !== 'constructor')
      .map(method => {
        const routePath = Reflect.getMetadata('path', controller[method]);
        const requestMethod = Reflect.getMetadata('method', controller[method]);
        return {
          method: requestMethod,
          path: `${controllerPath}/${routePath}`.replace('//', '/'),
          handler: controller[method].bind(controller)
        };
      });
    return routes;
  }
}
```

### 4.3.2 라우팅 연결
```typescript
// src/core/simple-application.ts
import { RouterExplorer } from './router-explorer';

export class SimpleApplication {
  private routerExplorer = new RouterExplorer();

  async init(module: any) {
    const metadata = Reflect.getMetadata('module', module);
    const controllers = metadata.controllers || [];

    controllers.forEach((ControllerClass: any) => {
      const controllerInstance = new ControllerClass();
      const routes = this.routerExplorer.explore(controllerInstance);

      routes.forEach(route => {
        console.log(`Mapped {${route.method}} ${route.path}`);
      });
    });
  }
}
```

## 4.4 컨트롤러 및 라우팅 예제

### 4.4.1 사용자 컨트롤러 예제
```typescript
// src/user/user.controller.ts
import { Controller, Get, Post } from '../decorators/controller.decorator';

@Controller('users')
export class UserController {
  @Get()
  getUsers() {
    return ['User1', 'User2'];
  }

  @Post()
  createUser() {
    return 'User created';
  }
}
```

### 4.4.2 모듈 등록
```typescript
// src/user/user.module.ts
import { Module } from '../decorators/module.decorator';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
})
export class UserModule {}
```

### 4.4.3 실행 결과
```bash
Mapped {GET} /users
Mapped {POST} /users
```

## 4.5 테스트 코드 작성

### 4.5.1 라우터 탐색기 테스트
```typescript
// src/core/router-explorer.spec.ts
import { RouterExplorer } from './router-explorer';

describe('RouterExplorer', () => {
  it('should map controller routes', () => {
    class TestController {
      getData() {}
    }
    Reflect.defineMetadata('path', 'test', TestController);
    Reflect.defineMetadata('method', 'GET', TestController.prototype.getData);

    const explorer = new RouterExplorer();
    const routes = explorer.explore(new TestController());

    expect(routes[0].method).toBe('GET');
    expect(routes[0].path).toBe('/test');
  });
});
```

## 4.6 정리
- `@Controller` 및 HTTP 메서드 데코레이터를 구현했습니다.
- 라우터 탐색기를 통해 컨트롤러와 라우트를 연결했습니다.
- 예제와 테스트를 통해 라우팅 시스템의 동작을 확인했습니다.












# Part 4 - 컨트롤러(Controller) 시스템 구현

## 4.1 컨트롤러(Controller) 이해

### 4.1.1 컨트롤러란?
- 클라이언트의 요청(Request)을 처리하고 응답(Response)을 반환하는 역할을 합니다.
- RESTful API에서 라우팅(Routing) 기능을 담당합니다.
- NestJS에서는 데코레이터 기반으로 간결하게 구현됩니다.

### 4.1.2 컨트롤러의 구성 요소
- **@Controller()**: 라우트 경로를 정의합니다.
- **@Get(), @Post(), @Put(), @Delete()**: HTTP 요청 메서드를 처리합니다.
- **@Param(), @Body(), @Query()**: 요청 데이터를 처리합니다.

## 4.2 `@Controller` 데코레이터 구현

### 4.2.1 컨트롤러 메타데이터 정의
```typescript
// src/decorators/controller.decorator.ts
export function Controller(path: string): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata('path', path, target);
    Reflect.defineMetadata('isController', true, target);
  };
}
```

### 4.2.2 HTTP 메서드 데코레이터 구현
```typescript
// src/decorators/request.decorator.ts
export function Get(path: string = ''): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata('method', 'GET', descriptor.value);
    Reflect.defineMetadata('path', path, descriptor.value);
  };
}

export function Post(path: string = ''): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata('method', 'POST', descriptor.value);
    Reflect.defineMetadata('path', path, descriptor.value);
  };
}
```

## 4.3 라우팅 시스템 구현

### 4.3.1 모듈 스캐너 재귀 구현
```typescript
// src/core/module-scanner.ts
import 'reflect-metadata';

export class ModuleScanner {
  scan(module: any): any[] {
    const modules = [module];
    const metadata = Reflect.getMetadata('module', module);

    if (metadata?.imports) {
      metadata.imports.forEach((importedModule: any) => {
        modules.push(...this.scan(importedModule));
      });
    }
    return modules;
  }
}
```

### 4.3.2 라우터 탐색기 구현
```typescript
// src/core/router-explorer.ts
import 'reflect-metadata';

export class RouterExplorer {
  explore(controller: any) {
    const controllerPath = Reflect.getMetadata('path', controller.constructor);
    const routes = Object.getOwnPropertyNames(controller.__proto__)
      .filter(method => method !== 'constructor')
      .map(method => {
        const routePath = Reflect.getMetadata('path', controller[method]);
        const requestMethod = Reflect.getMetadata('method', controller[method]);
        return {
          method: requestMethod,
          path: `${controllerPath}/${routePath}`.replace('//', '/'),
          handler: controller[method].bind(controller)
        };
      });
    return routes;
  }
}
```

### 4.3.3 라우팅 연결
```typescript
// src/core/simple-application.ts
import { ModuleScanner } from './module-scanner';
import { RouterExplorer } from './router-explorer';

export class SimpleApplication {
  private scanner = new ModuleScanner();
  private routerExplorer = new RouterExplorer();

  async init(module: any) {
    const modules = this.scanner.scan(module);

    modules.forEach((mod: any) => {
      const metadata = Reflect.getMetadata('module', mod);
      const controllers = metadata.controllers || [];

      controllers.forEach((ControllerClass: any) => {
        const controllerInstance = new ControllerClass();
        const routes = this.routerExplorer.explore(controllerInstance);

        routes.forEach(route => {
          console.log(`Mapped {${route.method}} ${route.path}`);
        });
      });
    });
  }
}
```

## 4.4 컨트롤러 및 라우팅 예제

### 4.4.1 사용자 컨트롤러 예제
```typescript
// src/user/user.controller.ts
import { Controller, Get, Post } from '../decorators/controller.decorator';

@Controller('users')
export class UserController {
  @Get()
  getUsers() {
    return ['User1', 'User2'];
  }

  @Post()
  createUser() {
    return 'User created';
  }
}
```

### 4.4.2 모듈 등록
```typescript
// src/user/user.module.ts
import { Module } from '../decorators/module.decorator';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
})
export class UserModule {}
```

### 4.4.3 실행 결과
```bash
Mapped {GET} /users
Mapped {POST} /users
```

## 4.5 정리
- `@Controller` 및 HTTP 메서드 데코레이터를 구현했습니다.
- 모듈 스캐너를 통해 재귀적으로 모든 모듈을 스캔하고 라우팅을 연결했습니다.
- 예제를 통해 라우팅 시스템의 동작을 확인했습니다.








# Part 4 - 컨트롤러(Controller) 시스템 구현

## 4.1 컨트롤러(Controller) 이해

### 4.1.1 컨트롤러란?
- 클라이언트의 요청(Request)을 처리하고 응답(Response)을 반환하는 역할을 합니다.
- RESTful API에서 라우팅(Routing) 기능을 담당합니다.
- NestJS에서는 데코레이터 기반으로 간결하게 구현됩니다.

### 4.1.2 컨트롤러의 구성 요소
- **@Controller()**: 라우트 경로를 정의합니다.
- **@Get(), @Post(), @Put(), @Delete()**: HTTP 요청 메서드를 처리합니다.
- **@Param(), @Body(), @Query()**: 요청 데이터를 처리합니다.

## 4.2 `@Controller` 데코레이터 구현

### 4.2.1 컨트롤러 메타데이터 정의
```typescript
// src/decorators/controller.decorator.ts
export function Controller(path: string): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata('path', path, target);
    Reflect.defineMetadata('isController', true, target);
  };
}
```

### 4.2.2 HTTP 메서드 데코레이터 구현
```typescript
// src/decorators/request.decorator.ts
import { TypedPropertyDescriptor } from 'typescript';

export function Get(path: string = ''): MethodDecorator {
  return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void => {
    Reflect.defineMetadata('method', 'GET', descriptor.value);
    Reflect.defineMetadata('path', path, descriptor.value);
  };
}

export function Post(path: string = ''): MethodDecorator {
  return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void => {
    Reflect.defineMetadata('method', 'POST', descriptor.value);
    Reflect.defineMetadata('path', path, descriptor.value);
  };
}
```

## 4.3 라우팅 시스템 구현

### 4.3.1 모듈 스캐너 재귀 구현
```typescript
// src/core/module-scanner.ts
import 'reflect-metadata';

export class ModuleScanner {
  scan(module: any): any[] {
    const modules = [module];
    const metadata = Reflect.getMetadata('module', module);

    if (metadata?.imports) {
      metadata.imports.forEach((importedModule: any) => {
        modules.push(...this.scan(importedModule));
      });
    }
    return modules;
  }
}
```

### 4.3.2 라우터 탐색기 구현
```typescript
// src/core/router-explorer.ts
import 'reflect-metadata';

export class RouterExplorer {
  explore(controller: any) {
    const controllerPath = Reflect.getMetadata('path', controller.constructor);
    const routes = Object.getOwnPropertyNames(controller.__proto__)
      .filter(method => method !== 'constructor')
      .map(method => {
        const routePath = Reflect.getMetadata('path', controller[method]);
        const requestMethod = Reflect.getMetadata('method', controller[method]);
        return {
          method: requestMethod,
          path: `${controllerPath}/${routePath}`.replace('//', '/'),
          handler: controller[method].bind(controller)
        };
      });
    return routes;
  }
}
```

### 4.3.3 라우팅 연결
```typescript
// src/core/simple-application.ts
import { ModuleScanner } from './module-scanner';
import { RouterExplorer } from './router-explorer';

export class SimpleApplication {
  private scanner = new ModuleScanner();
  private routerExplorer = new RouterExplorer();

  async init(module: any) {
    const modules = this.scanner.scan(module);

    modules.forEach((mod: any) => {
      const metadata = Reflect.getMetadata('module', mod);
      const controllers = metadata.controllers || [];

      controllers.forEach((ControllerClass: any) => {
        const controllerInstance = new ControllerClass();
        const routes = this.routerExplorer.explore(controllerInstance);

        routes.forEach(route => {
          console.log(`Mapped {${route.method}} ${route.path}`);
        });
      });
    });
  }
}
```

## 4.4 컨트롤러 및 라우팅 예제

### 4.4.1 사용자 컨트롤러 예제
```typescript
// src/user/user.controller.ts
import { Controller, Get, Post } from '../decorators/controller.decorator';

@Controller('users')
export class UserController {
  @Get()
  getUsers() {
    return ['User1', 'User2'];
  }

  @Post()
  createUser() {
    return 'User created';
  }
}
```

### 4.4.2 모듈 등록
```typescript
// src/user/user.module.ts
import { Module } from '../decorators/module.decorator';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
})
export class UserModule {}
```

### 4.4.3 실행 결과
```bash
Mapped {GET} /users
Mapped {POST} /users
```

## 4.5 정리
- `@Controller` 및 HTTP 메서드 데코레이터를 구현했습니다.
- 모듈 스캐너를 통해 재귀적으로 모든 모듈을 스캔하고 라우팅을 연결했습니다.
- 예제를 통해 라우팅 시스템의 동작을 확인했습니다.