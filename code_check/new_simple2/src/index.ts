// import {SimpleApplication} from "./simple-application";
// import {TestController} from "./test.controller";
//
// async function bootstrap() {
//     const app = new SimpleApplication(([TestController]));
//     await app.listen(3000);
// }
//
// bootstrap();


import {NestFactory} from "./core/nest-factory";
import {ApplicationModule} from "./app.module";


async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);
    await app.listen(3000);
}
bootstrap();
