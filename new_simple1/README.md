# 프로젝트 초기화

## 타입스크립트 설정, Express, reflect-metadata 설치
```bash
npm init -y
npm install typescript @types/node @types/express --save-dev
npm install reflect-metadata express

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

## jest 설정
* [Jest - Getting Started](https://jestjs.io/docs/getting-started#using-typescript)
* [ts-jest - Installation](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation/#jest-config-file)
```bash
npm install ts-jest @types/jest --save-dev
npm install --save-dev @babel/preset-typescript

npx ts-jest config:init
```
### babel.config.js
```js
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],
};
```
### jest.config.js
```js
/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};
```