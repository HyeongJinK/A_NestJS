# Part 7 - 최종 실습 프로젝트: Todo List API

## 7.1 프로젝트 목표

- 간단한 **Todo List API**를 구현하여 NestJS 프레임워크의 핵심 개념을 실습합니다.
- CRUD(생성, 조회, 수정, 삭제) 기능을 포함한 RESTful API를 구성합니다.

## 7.2 프로젝트 구조

```
simple-nestjs/
├── src/
│   ├── index.ts
│   ├── app.module.ts
│   ├── todo/
│   │   ├── todo.module.ts
│   │   ├── todo.controller.ts
│   │   ├── todo.service.ts
│   │   └── todo.model.ts
│   ├── decorators/
│   │   ├── controller.decorator.ts
│   │   └── request.decorator.ts
│   ├── core/
│   │   ├── simple-application.ts
│   │   └── nest-factory.ts
│   └── common/
│       └── exceptions/
│           └── not-found.exception.ts
├── package.json
├── tsconfig.json
└── node_modules/
```

## 7.3 Todo 모델 구현

### 7.3.1 Todo 데이터 모델
```typescript
// src/todo/todo.model.ts
export interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
}
```

## 7.4 서비스(Service) 구현

### 7.4.1 Todo 서비스 로직
```typescript
// src/todo/todo.service.ts
import { Todo } from './todo.model';

export class TodoService {
  private todos: Todo[] = [];
  private idCounter = 1;

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    return this.todos.find(todo => todo.id === id);
  }

  create(title: string): Todo {
    const newTodo: Todo = { id: this.idCounter++, title, isCompleted: false };
    this.todos.push(newTodo);
    return newTodo;
  }

  update(id: number, title: string): Todo {
    const todo = this.findOne(id);
    if (todo) {
      todo.title = title;
    }
    return todo;
  }

  delete(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
}
```

## 7.5 컨트롤러(Controller) 구현

### 7.5.1 Todo 컨트롤러
```typescript
// src/todo/todo.controller.ts
import { Controller, Get, Post, Put, Delete } from '../decorators/controller.decorator';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  private todoService = new TodoService();

  @Get()
  getAllTodos() {
    return this.todoService.findAll();
  }

  @Post()
  createTodo(title: string) {
    return this.todoService.create(title);
  }

  @Put(':id')
  updateTodo(id: number, title: string) {
    return this.todoService.update(id, title);
  }

  @Delete(':id')
  deleteTodo(id: number) {
    this.todoService.delete(id);
    return { message: 'Todo deleted' };
  }
}
```

## 7.6 모듈(Module) 구성

### 7.6.1 Todo 모듈 등록
```typescript
// src/todo/todo.module.ts
import { Module } from '../decorators/module.decorator';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
```

### 7.6.2 AppModule에 TodoModule 추가
```typescript
// src/app.module.ts
import { Module } from './decorators/module.decorator';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [TodoModule],
})
export class AppModule {}
```

## 7.7 서버 실행

### 7.7.1 서버 부트스트랩
```typescript
// src/index.ts
import { NestFactory } from './core/nest-factory';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log('Server is running on http://localhost:3000');
}

bootstrap();
```

## 7.8 API 테스트

### 7.8.1 API 테스트 예시

- **Todo 전체 조회**
  ```bash
  curl -X GET http://localhost:3000/todos
  ```

- **Todo 생성**
  ```bash
  curl -X POST http://localhost:3000/todos -d "title=Learn NestJS"
  ```

- **Todo 수정**
  ```bash
  curl -X PUT http://localhost:3000/todos/1 -d "title=Learn Advanced NestJS"
  ```

- **Todo 삭제**
  ```bash
  curl -X DELETE http://localhost:3000/todos/1
  ```

## 7.9 정리

- Todo List API를 통해 CRUD 기능을 실습했습니다.
- NestJS의 모듈, 컨트롤러, 서비스 구조를 활용했습니다.
- 실습을 통해 전체 애플리케이션 흐름을 이해했습니다.

