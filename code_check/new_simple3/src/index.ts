import {NestFactory} from "./core/nest-factory";
import {ApplicationModule} from "./app.module";


async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);
    await app.listen(3000);
}
bootstrap();
