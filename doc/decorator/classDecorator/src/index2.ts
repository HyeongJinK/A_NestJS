function LogClass(logString: string) {
    return function (constructor: Function) {
        console.log(logString);
        console.log("name:", constructor.name);
    };
}

@LogClass("Logging")
class Car {
    constructor(public model: string) {}
}

// Logging
// name: Car
