import iterate from 'iterare';
// import {Injectable} from "../common/interfaces/injectable.interface";
import {isConstructor, isNil, isFunction} from "../common/shared.utils";

export class MetadataScanner {
    // public scanFromPrototype<T extends Injectable, R>(instance: T, prototype: any, callback: (name: string) => R): R[] {
    //     return iterate(Object.getOwnPropertyNames(prototype))
    //         .filter((method) => {
    //             const descriptor = <PropertyDescriptor> Object.getOwnPropertyDescriptor(prototype, method);
    //             if (descriptor.set || descriptor.get) {
    //                 return false;
    //             }
    //             return !isConstructor(method) && isFunction(prototype[method]);
    //         })
    //         .map(callback)
    //         .filter((metadata) => !isNil(metadata))
    //         .toArray();
    // }
}