import {Controller} from "../../src/decorators/controller.decorator";

@Controller("/test")
class TestController {
    public test() {
        return "test";
    }
}

describe("Controller Decorator", () => {
    test("path 메타데이터 설정값 확인", () => {
        let path = Reflect.getMetadata("path", TestController);
        expect(path).toBe("/test");
    });
});