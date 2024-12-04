class Test {
    x: number = 10;
    constructor() {
        console.log('Test');
        // x = 100; // Cannot find name x. Did you mean the instance member
    }

    hello(y: number = 10) {
        console.log('hello');
        console.log(this.x + y);
    }
}

const test = new Test();
test.hello();

//let tt: any = Test['hello'];
let tt = Test.prototype.hello;

console.log(tt);
tt();
