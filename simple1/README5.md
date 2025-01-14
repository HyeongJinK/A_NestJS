# Part 5 - 예외 처리 및 에러 핸들링 구현

## 5.1 예외 처리의 필요성

### 5.1.1 예외 처리란?
- 프로그램 실행 중 발생할 수 있는 오류를 처리하여 서비스의 안정성을 높이는 기능입니다.
- 클라이언트에게 일관된 에러 응답을 제공하고 서버의 비정상 종료를 방지합니다.

### 5.1.2 예외 처리 시스템의 구성 요소
- **HTTPException:** 표준 HTTP 상태 코드와 메시지를 활용한 에러 응답
- **Exception Filter:** 전역 또는 특정 범위의 예외 처리
- **Custom Exception:** 특정 상황에 맞는 사용자 정의 예외

## 5.2 기본 예외 처리 구현

### 5.2.1 `HttpException` 클래스 구현
```typescript
// src/common/exceptions/http-exception.ts
export class HttpException extends Error {
  constructor(public message: string, public status: number) {
    super(message);
  }
}
```

### 5.2.2 기본 예외 필터 구현
```typescript
// src/core/exceptions/exceptions-handler.ts
import { HttpException } from '../../common/exceptions/http-exception';

export class ExceptionsHandler {
  handle(error: Error) {
    if (error instanceof HttpException) {
      console.error(`HTTP Error: ${error.status} - ${error.message}`);
    } else {
      console.error(`Unexpected Error: ${error.message}`);
    }
  }
}
```

## 5.3 전역 예외 처리기 등록

### 5.3.1 예외 처리기 연결
```typescript
// src/core/simple-application.ts
import { ExceptionsHandler } from './exceptions/exceptions-handler';

export class SimpleApplication {
  private exceptionsHandler = new ExceptionsHandler();

  async init(module: any) {
    try {
      // 기존 초기화 로직
    } catch (error) {
      this.exceptionsHandler.handle(error);
    }
  }
}
```

## 5.4 커스텀 예외 구현

### 5.4.1 커스텀 예외 클래스 생성
```typescript
// src/common/exceptions/not-found.exception.ts
import { HttpException } from './http-exception';

export class NotFoundException extends HttpException {
  constructor(message: string = 'Resource Not Found') {
    super(message, 404);
  }
}
```

### 5.4.2 컨트롤러에서 커스텀 예외 사용
```typescript
// src/user/user.controller.ts
import { Controller, Get } from '../decorators/controller.decorator';
import { NotFoundException } from '../common/exceptions/not-found.exception';

@Controller('users')
export class UserController {
  @Get()
  getUsers() {
    throw new NotFoundException('No users found');
  }
}
```

## 5.5 예외 필터 확장

### 5.5.1 고급 예외 필터 구현
```typescript
// src/core/exceptions/advanced-exceptions-handler.ts
import { HttpException } from '../../common/exceptions/http-exception';

export class AdvancedExceptionsHandler {
  handle(error: Error) {
    if (error instanceof HttpException) {
      console.error(`[HTTP ERROR] Status: ${error.status}, Message: ${error.message}`);
    } else {
      console.error(`[GENERAL ERROR] ${error.message}`);
    }
  }
}
```

### 5.5.2 전역 예외 필터로 등록
```typescript
// src/core/simple-application.ts
import { AdvancedExceptionsHandler } from './exceptions/advanced-exceptions-handler';

export class SimpleApplication {
  private exceptionsHandler = new AdvancedExceptionsHandler();

  async init(module: any) {
    try {
      // 기존 초기화 로직
    } catch (error) {
      this.exceptionsHandler.handle(error);
    }
  }
}
```

## 5.6 테스트 코드 작성

### 5.6.1 예외 처리 테스트
```typescript
// src/core/exceptions/exceptions-handler.spec.ts
import { ExceptionsHandler } from './exceptions-handler';
import { HttpException } from '../../common/exceptions/http-exception';

describe('ExceptionsHandler', () => {
  let handler: ExceptionsHandler;

  beforeEach(() => {
    handler = new ExceptionsHandler();
  });

  it('should handle HttpException', () => {
    const error = new HttpException('Error occurred', 400);
    console.error = jest.fn();
    handler.handle(error);
    expect(console.error).toHaveBeenCalledWith('HTTP Error: 400 - Error occurred');
  });

  it('should handle unexpected errors', () => {
    const error = new Error('Unexpected error');
    console.error = jest.fn();
    handler.handle(error);
    expect(console.error).toHaveBeenCalledWith('Unexpected Error: Unexpected error');
  });
});
```

## 5.7 정리

- `HttpException`을 통해 표준 에러 응답 구조를 구현했습니다.
- 전역 예외 필터를 통해 시스템 전반의 오류를 통합적으로 관리했습니다.
- 커스텀 예외를 활용해 다양한 상황에 맞는 에러 처리를 구현했습니다.

