import {Controller, Get, Query} from "./common/decorators";
import {TestService} from "./test.service";


@Controller("/abc")
export class TestController {
    asdfg = "test";

    constructor(
        private readonly testService: TestService
    ) {
        console.log("TestController constructor");
    }

    @Get('/test')
    test(@Query('id') id: string) {
        console.log(`id: ${id}`);
        console.log("TestController test");
        return "test";
    }

    @Get('/hello')
    hello() {
        return this.testService.getHello();
    }
}