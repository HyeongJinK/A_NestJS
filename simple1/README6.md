# Part 6 - 고급 기능 추가

## 6.1 미들웨어(Middleware) 구현

### 6.1.1 미들웨어란?
- 요청(Request)과 응답(Response) 사이에서 특정 로직을 처리하는 중간 처리기입니다.
- 인증, 로깅, 요청 데이터 가공 등의 기능을 수행합니다.

### 6.1.2 미들웨어 인터페이스 정의
```typescript
// src/common/interfaces/middleware.interface.ts
export interface Middleware {
  use(req: any, res: any, next: () => void): void;
}
```

### 6.1.3 로깅 미들웨어 구현
```typescript
// src/middlewares/logger.middleware.ts
import { Middleware } from '../common/interfaces/middleware.interface';

export class LoggerMiddleware implements Middleware {
  use(req: any, res: any, next: () => void): void {
    console.log(`[${req.method}] ${req.url}`);
    next();
  }
}
```

### 6.1.4 미들웨어 적용
```typescript
// src/core/simple-application.ts
import { LoggerMiddleware } from '../middlewares/logger.middleware';

export class SimpleApplication {
  private middlewares: Middleware[] = [new LoggerMiddleware()];

  async init(module: any) {
    this.middlewares.forEach(middleware => {
      middleware.use({ method: 'GET', url: '/' }, {}, () => {});
    });
  }
}
```

## 6.2 인터셉터(Interceptor) 구현

### 6.2.1 인터셉터란?
- 요청 전/후 로직을 처리하여 응답을 조작하거나 로깅하는 기능입니다.
- 로깅, 응답 가공, 캐싱 등에 사용됩니다.

### 6.2.2 인터셉터 인터페이스 정의
```typescript
// src/common/interfaces/interceptor.interface.ts
export interface Interceptor {
  intercept(context: any, next: () => any): any;
}
```

### 6.2.3 응답 시간 측정 인터셉터 구현
```typescript
// src/interceptors/timer.interceptor.ts
import { Interceptor } from '../common/interfaces/interceptor.interface';

export class TimerInterceptor implements Interceptor {
  intercept(context: any, next: () => any): any {
    const start = Date.now();
    const result = next();
    const end = Date.now();
    console.log(`Execution time: ${end - start}ms`);
    return result;
  }
}
```

### 6.2.4 인터셉터 적용
```typescript
// src/core/simple-application.ts
import { TimerInterceptor } from '../interceptors/timer.interceptor';

export class SimpleApplication {
  private interceptors: Interceptor[] = [new TimerInterceptor()];

  async init(module: any) {
    const context = {};
    this.interceptors.forEach(interceptor => {
      interceptor.intercept(context, () => {
        console.log('Request processed');
      });
    });
  }
}
```

## 6.3 라이프사이클 후크(Lifecycle Hooks) 구현

### 6.3.1 라이프사이클 후크란?
- 애플리케이션의 시작과 종료 시 특정 작업을 수행할 수 있도록 제공하는 메커니즘입니다.

### 6.3.2 라이프사이클 인터페이스 정의
```typescript
// src/common/interfaces/on-init.interface.ts
export interface OnInit {
  onInit(): void;
}

// src/common/interfaces/on-destroy.interface.ts
export interface OnDestroy {
  onDestroy(): void;
}
```

### 6.3.3 모듈에 라이프사이클 후크 적용
```typescript
// src/user/user.service.ts
import { OnInit, OnDestroy } from '../common/interfaces/on-init.interface';

export class UserService implements OnInit, OnDestroy {
  onInit(): void {
    console.log('UserService initialized');
  }

  onDestroy(): void {
    console.log('UserService destroyed');
  }
}
```

### 6.3.4 후크 실행
```typescript
// src/core/simple-application.ts
import { UserService } from '../user/user.service';

export class SimpleApplication {
  private services = [new UserService()];

  async init(module: any) {
    this.services.forEach(service => {
      if ('onInit' in service) {
        service.onInit();
      }
    });
  }

  async close() {
    this.services.forEach(service => {
      if ('onDestroy' in service) {
        service.onDestroy();
      }
    });
  }
}
```

## 6.4 고급 기능 테스트 코드 작성

### 6.4.1 미들웨어 테스트
```typescript
// src/middlewares/logger.middleware.spec.ts
import { LoggerMiddleware } from './logger.middleware';

describe('LoggerMiddleware', () => {
  it('should log request method and url', () => {
    const middleware = new LoggerMiddleware();
    console.log = jest.fn();

    middleware.use({ method: 'GET', url: '/test' }, {}, () => {});

    expect(console.log).toHaveBeenCalledWith('[GET] /test');
  });
});
```

### 6.4.2 인터셉터 테스트
```typescript
// src/interceptors/timer.interceptor.spec.ts
import { TimerInterceptor } from './timer.interceptor';

describe('TimerInterceptor', () => {
  it('should log execution time', () => {
    const interceptor = new TimerInterceptor();
    console.log = jest.fn();

    interceptor.intercept({}, () => {});

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Execution time:'));
  });
});
```

## 6.5 정리

- 미들웨어와 인터셉터를 통해 요청과 응답 전후에 다양한 로직을 적용했습니다.
- 라이프사이클 후크를 통해 애플리케이션의 시작과 종료 시 필요한 작업을 수행했습니다.
- 고급 기능들의 안정성을 테스트 코드를 통해 검증했습니다.

