import {Get} from "../../src/decorators/request.decorator";
import {METHOD_METADATA, PATH_METADATA} from "../../src/common/constants";

class TestController {

    @Get('/test')
    getTest() {
        return "test";
    }
}



describe("Request Decorator", () => {
    test("path 메타데이터 설정값 확인", () => {
        const path = Reflect.getMetadata(PATH_METADATA, TestController.prototype.getTest);
        const method = Reflect.getMetadata(METHOD_METADATA, TestController.prototype.getTest);
        expect(path).toBe("/test");
        expect(method).toBe("GET");
    });
});