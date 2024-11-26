import {Module} from "./decorators/module.decorator";
import {TestController} from "./test.controller";

@Module({
    controllers: [TestController],
})
export class ApplicationModule {
}