import http from 'http';
import { AppModule } from './app.module';
import { routes } from './decorators';
import { container } from './di-container';
import { AppController } from './app.controller';

// 애플리케이션 모듈 초기화
new AppModule();

const server = http.createServer((req, res) => {
  const handler = routes.get(req.url || '');
  
  if (handler) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(handler.call(container.resolve(AppController)));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
