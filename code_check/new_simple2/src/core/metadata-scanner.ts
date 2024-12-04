import iterate from 'iterare';
import {Injectable} from "../common/interfaces/injectable.interface";
import {isConstructor, isFunction, isNil} from "../common/shared.utils";
import {Logger} from "../common/services/logger.service";

export class MetadataScanner {
    private readonly logger = new Logger('MetadataScanner', true);
    public scanFromPrototype<T extends Injectable, R>(instance: T, prototype: any, callback: (name: string) => R): R[] {
        return iterate(Object.getOwnPropertyNames(prototype))
            .filter((method) => {
                this.logger.log(`scanFromPrototype() method: ${method}`);
                const descriptor = <PropertyDescriptor> Object.getOwnPropertyDescriptor(prototype, method);
                this.logger.log(`scanFromPrototype() descriptor.set: ${descriptor.set}, descriptor.get: ${descriptor.get}`);
                if (descriptor.set || descriptor.get) {
                    return false;
                }
                return !isConstructor(method) && isFunction(prototype[method]);
            })
            .map(callback)
            .filter((metadata) => !isNil(metadata))
            .toArray();
    }
}