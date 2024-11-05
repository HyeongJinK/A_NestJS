import {SimpleApplication} from "./simple-application";
import {TestController} from "./test.controller";

async function bootstrap() {
    const app = new SimpleApplication(([TestController]));
    await app.listen(3000);
}

bootstrap();