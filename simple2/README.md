## 실행 방법

```bash
npm install typescript @types/node --save-dev
npm install reflect-metadata
npx tsc --init

npx tsc
node index.ts
```

## 데코레이터를 사용하기 위해서

tsconfig.json
```json
 "experimentalDecorators": true,
```