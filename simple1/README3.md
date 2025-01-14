# Part 3 - 모듈(Module) 시스템 구현

## 3.1 모듈 시스템 이해

### 3.1.1 모듈(Module)이란?
- NestJS의 기본 단위로서 관련 기능을 하나의 그룹으로 묶어 관리합니다.
- 의존성 주입(Dependency Injection) 기반으로 서비스, 컨트롤러, 프로바이더를 관리합니다.

### 3.1.2 모듈의 구성 요소
- **controllers:** HTTP 요청을 처리하는 컨트롤러
- **providers:** 비즈니스 로직을 처리하는 서비스
- **imports:** 다른 모듈을 가져오기 위한 항목
- **exports:** 외부에 제공할 서비스

## 3.2 `@Module` 데코레이터 구현

### 3.2.1 `@Module` 데코레이터 개요
- 모듈의 메타데이터를 정의하고 NestFactory에서 이를 활용해 의존성을 주입합니다.

### 3.2.2 `module.decorator.ts` 구현
```typescript
// src/decorators/module.decorator.ts
export interface ModuleMetadata {
  controllers?: any[];
  providers?: any[];
  imports?: any[];
  exports?: any[];
}

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata('module', metadata, target);
  };
}
```

## 3.3 모듈 초기화 및 의존성 주입

### 3.3.1 모듈 스캐너 구현
- 모듈의 메타데이터를 스캔하여 컨트롤러와 프로바이더를 초기화합니다.

```typescript
// src/core/module-scanner.ts
import 'reflect-metadata';

export class ModuleScanner {
  scan(module: any) {
    const metadata = Reflect.getMetadata('module', module);
    console.log('Scanning Module:', metadata);
    return metadata;
  }
}
```

### 3.3.2 모듈 초기화
```typescript
// src/core/simple-application.ts
import { ModuleScanner } from './module-scanner';

export class SimpleApplication {
  private scanner = new ModuleScanner();

  async init(module: any) {
    const metadata = this.scanner.scan(module);
    console.log('Controllers:', metadata.controllers);
    console.log('Providers:', metadata.providers);
  }
}
```

## 3.4 컨트롤러 및 서비스 구현

### 3.4.1 컨트롤러 데코레이터
```typescript
// src/decorators/controller.decorator.ts
export function Controller(path: string): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata('path', path, target);
  };
}
```

### 3.4.2 서비스 데코레이터
```typescript
// src/decorators/injectable.decorator.ts
export function Injectable(): ClassDecorator {
  return (target: Function) => {};
}
```

### 3.4.3 서비스 및 컨트롤러 예제
```typescript
// src/user/user.service.ts
import { Injectable } from '../decorators/injectable.decorator';

@Injectable()
export class UserService {
  getUsers() {
    return ['User1', 'User2'];
  }
}

// src/user/user.controller.ts
import { Controller } from '../decorators/controller.decorator';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  getAllUsers() {
    return this.userService.getUsers();
  }
}
```

## 3.5 모듈 통합 및 실행

### 3.5.1 사용자 모듈(UserModule) 구현
```typescript
// src/user/user.module.ts
import { Module } from '../decorators/module.decorator';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

### 3.5.2 AppModule에서 UserModule 연결
```typescript
// src/app.module.ts
import { Module } from './decorators/module.decorator';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
})
export class AppModule {}
```

## 3.6 테스트 코드 작성

### 3.6.1 모듈 스캐너 테스트
```typescript
// src/core/module-scanner.spec.ts
import { ModuleScanner } from './module-scanner';

describe('ModuleScanner', () => {
  it('should scan module metadata', () => {
    class TestModule {}
    Reflect.defineMetadata('module', { controllers: [] }, TestModule);

    const scanner = new ModuleScanner();
    const metadata = scanner.scan(TestModule);

    expect(metadata).toHaveProperty('controllers');
  });
});
```

## 3.7 정리
- `@Module` 데코레이터를 통해 모듈 메타데이터를 정의했습니다.
- 모듈 스캐너를 이용해 의존성을 스캔하고 초기화했습니다.
- 컨트롤러와 서비스를 연결해 모듈 시스템을 완성했습니다.

