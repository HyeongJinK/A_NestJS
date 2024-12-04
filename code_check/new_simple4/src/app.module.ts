import {Module} from "./decorators/module.decorator";
import {TestController} from "./test.controller";

@Module({
    controllers: [TestController],
    components: [],
})
export class ApplicationModule {
}