import 'reflect-metadata';
import {PATH_METADATA} from "../common/constants";

/**
 * @param prefix URL 경로
 * */
export function Controller(prefix?: string): ClassDecorator {
    const path = prefix ? prefix : '/';

    return (target: object) => {
        Reflect.defineMetadata(PATH_METADATA, path, target);
    }
}