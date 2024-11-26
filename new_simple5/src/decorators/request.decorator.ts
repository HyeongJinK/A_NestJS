import 'reflect-metadata';
import {METHOD_METADATA, PATH_METADATA} from "../common/constants";

export function Get(path?: string): MethodDecorator {
    return (target
            , propertyName
            , descriptor: PropertyDescriptor) => {
        // console.log('target:', target); // target: {}
        // console.log('key:', propertyName);  // key: test
        // console.log('descriptor:', descriptor);
        // /*
        //     descriptor: {
        //         value: [Function: test],
        //         writable: true,
        //         enumerable: false,
        //         configurable: true
        //     }
        // * */
        // console.log('descriptor.value:', descriptor.value); // descriptor.value: [Function: test]
        Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
        Reflect.defineMetadata(METHOD_METADATA, 'get', descriptor.value);

        return descriptor;
    };
}