import http from 'http';
import { AppModule } from './app.module';
import { handleRequest } from './decorators';
import { parseUrl } from './utils';
import { container } from './di-container';
import { AppController } from './app.controller';

// 애플리케이션 모듈 초기화
new AppModule();

const server = http.createServer((req, res) => {
  const { pathname, queryParams } = parseUrl(req.url || '');
  const routeResult = handleRequest(pathname, req.method || '');

  if (routeResult) {
    const { handler, pathParams, params } = routeResult;
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    const controller = container.resolve(AppController);

    const paramMetadata = Reflect.getOwnMetadata('params', controller, handler.name) || {};
    const args: any[] = [];

    // 경로 변수 주입 처리
    if (params) {
      params.forEach((paramName, index) => {
        if (paramMetadata[paramName] !== undefined) {
          args[paramMetadata[paramName]] = pathParams[paramName];
        }
      });
    }

    const result = handler.apply(controller, args); // 메서드 호출 시 파라미터 전달
    res.end(result);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
