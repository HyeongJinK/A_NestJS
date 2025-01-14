# Part 1 - 프로젝트 환경 설정

## 1.1 Node.js와 TypeScript 환경 구축

### 1.1.1 Node.js 설치

- [Node.js 공식 홈페이지](https://nodejs.org/)에서 최신 LTS 버전을 설치합니다.
- 설치 확인:
  ```bash
  node -v
  npm -v
  ```

### 1.1.2 TypeScript 설치

- 글로벌 설치:
  ```bash
  npm install -g typescript
  ```
- 설치 확인:
  ```bash
  tsc -v
  ```

## 1.2 프로젝트 초기화 및 설정

### 1.2.1 프로젝트 생성

```bash
mkdir simple-nestjs
cd simple-nestjs
npm init -y
```

### 1.2.2 필수 패키지 설치

```bash
npm install --save-dev typescript ts-node @types/node
npm install express
npm install --save-dev @types/express
npm install reflect-metadata
```

- `typescript`, `ts-node`: TypeScript 컴파일 및 실행 도구
- `express`: 서버 프레임워크
- `reflect-metadata`: 데코레이터 기능 구현에 필수 패키지

### 1.2.3 TypeScript 설정

```bash
npx tsc --init
```

### 1.2.4 `tsconfig.json` 생성 및 설정

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 1.3 폴더 구조 설계 및 파일 작성

### 1.3.1 기본 폴더 구조 및 파일 내용

```
simple-nestjs/
├── src/
│   ├── index.ts
│   ├── app.module.ts
│   ├── core/
│   │   ├── nest-factory.ts
│   │   ├── simple-application.ts
│   │   └── express-adapter.ts
│   ├── common/
│   │   └── constants.ts
│   └── decorators/
│       ├── module.decorator.ts
│       ├── controller.decorator.ts
│       └── request.decorator.ts
├── package.json
├── tsconfig.json
└── node_modules/
```

#### `src/app.module.ts`
```typescript
// src/app.module.ts
export class AppModule {}
```

#### `src/core/simple-application.ts`
```typescript
// src/core/simple-application.ts
export class SimpleApplication {
  async init(module: any) {
    console.log(`Application initialized with ${module.name}`);
  }

  async listen(port: number) {
    console.log(`Server is running on http://localhost:${port}`);
  }
}
```

#### `src/core/express-adapter.ts`
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

#### `src/common/constants.ts`
```typescript
// src/common/constants.ts
export const APP_NAME = 'SimpleNestJS';
```

#### `src/decorators/module.decorator.ts`
```typescript
// src/decorators/module.decorator.ts
export function Module(metadata: any): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata('module', metadata, target);
  };
}
```

#### `src/decorators/controller.decorator.ts`
```typescript
// src/decorators/controller.decorator.ts
export function Controller(path: string): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata('path', path, target);
  };
}
```

#### `src/decorators/request.decorator.ts`
```typescript
// src/decorators/request.decorator.ts
export function Get(path: string = ''): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata('method', 'GET', descriptor.value);
    Reflect.defineMetadata('path', path, descriptor.value);
  };
}
```

## 1.4 스크립트 설정

### 1.4.1 `package.json` 스크립트 추가

```json
"scripts": {
  "start": "ts-node src/index.ts",
  "build": "tsc",
  "start:prod": "node dist/index.js"
}
```

## 1.5 `NestFactory` 구현

### 1.5.1 `NestFactory` 개념
- 애플리케이션을 초기화하고 서버를 실행하는 역할을 담당합니다.

### 1.5.2 `nest-factory.ts` 파일 작성

```typescript
// src/core/nest-factory.ts
import { SimpleApplication } from './simple-application';

export class NestFactory {
  static async create(module: any) {
    const app = new SimpleApplication();
    await app.init(module);
    return app;
  }
}
```

## 1.6 실행 테스트

### 1.6.1 `index.ts` 파일 작성

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

## 1.7 정리

- Node.js와 TypeScript 기반 프로젝트를 초기화했습니다.
- 각 파일을 최소한의 내용으로 구성하여 프로젝트 구조를 완성했습니다.
- `NestFactory`를 구현하고 실행 테스트를 완료했습니다.

