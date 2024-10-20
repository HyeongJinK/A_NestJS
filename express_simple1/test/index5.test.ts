// __tests__/app.test.ts
import request from 'supertest';
import app from '../src/index5';

describe('AppController (e2e)', () => {
    it('GET / should return Hello, World!', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello, World!');
    });

    it('GET / with query parameter should return Hello, World!', async () => {
        const response = await request(app).get('/').query({ name: 'TestUser' });
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello, World!');
    });

    it('GET /test should return 204 No Content', async () => {
        const response = await request(app).get('/test');
        expect(response.status).toBe(204);
        expect(response.text).toBe('');
    });
});

describe('BoardController (e2e)', () => {
    it('GET /boards should return Board list', async () => {
        const response = await request(app).get('/boards');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Board list');
    });

    it('GET /boards/detail?id=123 should return board detail', async () => {
        const response = await request(app).get('/boards/detail').query({ id: '123' });
        expect(response.status).toBe(200);
        expect(response.text).toBe('Detail of board with id: 123');
    });

    it('GET /boards/:id should return board by id', async () => {
        const response = await request(app).get('/boards/123');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Board with id: 123');
    });
});
