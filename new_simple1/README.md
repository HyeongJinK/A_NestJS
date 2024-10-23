### 프로젝트 초기화
```bash
npm init -y
npm install typescript reflect-metadata express
npm install @types/express --save-dev
npx tsc --init
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "outDir": "./dist",
    
  },
  "include": ["src/**/*"]
}
```

