import {Module} from "../decorator/module.decorator";

// @ts-ignore
@Module({
    test2: 'test234'
})
class DeTEST {
}

function test() {
    let test = new DeTEST();
    console.log(test);
    console.log(Reflect.getMetadata('test2', DeTEST));
}

test();