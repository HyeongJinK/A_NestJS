// src/core/nest-factory.spec.ts
import { NestFactory } from './nest-factory';

describe('NestFactory', () => {
    it('should create an application instance', async () => {
        class TestModule {}
        const app = await NestFactory.create(TestModule);
        expect(app).toBeDefined();
    });
});