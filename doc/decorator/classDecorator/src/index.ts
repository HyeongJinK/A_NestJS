function SimpleDecorator(constructor: Function) {
    console.log("constructor:", constructor);
    console.log("constructor.prototype:", constructor.prototype);
    console.log("name:", constructor.name); // 클래스 이름 출력
}

@SimpleDecorator
class Person {
    constructor(public name: string) {}
}
// constructor: [class Person]
// constructor.prototype: {}
// name: Person
