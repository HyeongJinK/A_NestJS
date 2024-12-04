
// 6. 테스트 코드 작성
// __tests__/app.test.ts
// npm i jest supertest
import request from 'supertest';
import app from '../src/index4';

describe('AppController (e2e)', () => {
  it('GET / should return Hello, World!', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, World!');
  });

  it('GET /test should return Test', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Test');
  });
});