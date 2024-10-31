import {Controller} from "./decorators/controller.decorator";
import {Get} from "./decorators/request.decorator";

@Controller("/")
export class TestController {
    asdfg = "test";

    constructor() {
        console.log("TestController constructor");
    }

    @Get('/test')
    test() {
        console.log("TestController test");

    }
}