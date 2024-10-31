import {Controller} from "../../src/decorators/controller.decorator";
import {PATH_METADATA} from "../../src/common/constants";

@Controller("/test")
class TestController {
    public test() {
        return "test";
    }
}

describe("Controller Decorator", () => {
    test("path 메타데이터 설정값 확인", () => {
        let path = Reflect.getMetadata(PATH_METADATA, TestController);
        expect(path).toBe("/test");
    });
});