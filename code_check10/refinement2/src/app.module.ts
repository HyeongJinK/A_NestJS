
import {TestController} from "./test.controller";
import {Module} from "./common/decorators";
import {TestService} from "./test.service";

@Module({
    controllers: [TestController],
    providers: [TestService]
})
export class ApplicationModule {
}