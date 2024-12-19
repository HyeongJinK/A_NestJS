import {Controller, Get, Query} from "./common/decorators";


@Controller("/abc")
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