import {Controller} from "./decorators/controller.decorator";
import {Get} from "./decorators/request.decorator";
import {Param, Query} from "./decorators/route-params.decorator";

@Controller("/")
export class TestController {
    asdfg = "test";

    constructor() {
        console.log("TestController constructor");
    }

    @Get('/test')
    test(@Query('id') id: string) {
        console.log(`id: ${id}`);
        console.log("TestController test");
        return "test";
    }
}