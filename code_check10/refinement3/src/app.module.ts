
import {TestController} from "./test.controller";
import {Module} from "./common/decorators";

@Module({
    controllers: [TestController],
})
export class ApplicationModule {
}