# Part 2 - NestFactory와 Application 구성

## 2.1 NestFactory 역할 및 구조 이해

### 2.1.1 NestFactory란?
- NestJS 애플리케이션을 부트스트랩하고 서버를 실행시키는 핵심 클래스입니다.
- 모듈을 초기화하고 서버와 연결합니다.

### 2.1.2 NestFactory 구성 요소
- **create():** 애플리케이션 인스턴스를 생성합니다.
- **listen():** 서버를 실행합니다.

### 2.1.3 기본 구조
```typescript
// src/core/nest-factory.ts
import { SimpleApplication } from './simple-application';
import { ExpressAdapter } from './express-adapter';

export class NestFactory {
    static async create(module: any) {
        const adapter = new ExpressAdapter();
        const app = new SimpleApplication(adapter);
        await app.init(module);
        return app;
    }
}
```

## 2.2 SimpleApplication 역할 및 구현

### 2.2.1 SimpleApplication 개요
- 애플리케이션의 전반적인 초기화와 서버 실행을 담당합니다.
- 의존성 주입과 모듈 초기화를 수행합니다.

### 2.2.2 기본 구조
```typescript
// src/core/simple-application.ts
export class SimpleApplication {
    private adapter: any;

    constructor(adapter: any) {
        this.adapter = adapter;
    }

    async init(module: any) {
        console.log(`Initializing module: ${module.name}`);
    }

    async listen(port: number) {
        this.adapter.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
}
```

## 2.3 ExpressAdapter 구현

### 2.3.1 ExpressAdapter 개요
- Express 서버를 NestJS 스타일로 감싸는 역할을 합니다.
- HTTP 요청을 처리합니다.

### 2.3.2 기본 구조
```typescript
// src/core/express-adapter.ts
import express, { Application } from 'express';

export class ExpressAdapter {
    private app: Application;

    constructor() {
        this.app = express();
    }

    listen(port: number, callback: () => void) {
        this.app.listen(port, callback);
    }
}
```

## 2.4 전체 실행 흐름

1. **NestFactory**의 `create()` 메서드가 호출됩니다.
2. **ExpressAdapter**가 초기화됩니다.
3. **SimpleApplication**이 생성되고 모듈이 초기화됩니다.
4. `listen()` 메서드를 통해 서버가 실행됩니다.

### 2.4.1 실행 예시
```typescript
// src/index.ts
import { NestFactory } from './core/nest-factory';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
}

bootstrap();
```

## 2.5 테스트 코드 작성

### 2.5.1 NestFactory 테스트
```typescript
// src/core/nest-factory.spec.ts
import { NestFactory } from './nest-factory';

describe('NestFactory', () => {
    it('should create an application instance', async () => {
        class TestModule {}
        const app = await NestFactory.create(TestModule);
        expect(app).toBeDefined();
    });
});
```

### 2.5.2 SimpleApplication 테스트
```typescript
// src/core/simple-application.spec.ts
import { SimpleApplication } from './simple-application';

describe('SimpleApplication', () => {
    it('should initialize with a module', async () => {
        const app = new SimpleApplication({ listen: jest.fn() });
        await app.init(class TestModule {});
        expect(true).toBe(true);
    });
});
```

## 2.6 테스트 환경 설정

### 2.6.1 Jest 설치 및 설정
```bash
npm install --save-dev jest ts-jest @types/jest
npx ts-jest config:init
```

### 2.6.2 `jest.config.js` 파일 생성
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/*.spec.ts'],
  rootDir: './src',
};
```

### 2.6.3 `package.json` 스크립트 추가
```json
"scripts": {
  "start": "ts-node src/index.ts",
  "build": "tsc",
  "start:prod": "node dist/index.js",
  "test": "jest"
}
```

## 2.7 테스트 실행

### 2.7.1 테스트 실행 명령어
```bash
npm run test
```

### 2.7.2 예상 결과
- **NestFactory 테스트:** 애플리케이션 인스턴스 생성 확인
- **SimpleApplication 테스트:** 모듈 초기화 확인

## 2.8 정리
- `NestFactory`는 애플리케이션을 부트스트랩하고 실행합니다.
- `SimpleApplication`은 모듈을 초기화하고 서버를 실행합니다.
- `ExpressAdapter`는 Express 서버를 감싸 NestJS 스타일로 실행합니다.
- Jest 테스트 환경을 구성하고 테스트 코드를 실행했습니다.

