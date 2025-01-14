import { SimpleApplication } from './simple-application';
import { ExpressAdapter } from "./express-adapter";

export class NestFactory {
    static async create(module: any) {
        const adapter = new ExpressAdapter();
        const app = new SimpleApplication(adapter);
        await app.init(module);
        return app;
    }
}