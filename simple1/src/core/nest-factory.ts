import { SimpleApplication } from './simple-application';

export class NestFactory {
    static async create(module: any) {
        const app = new SimpleApplication();
        await app.init(module);
        return app;
    }
}