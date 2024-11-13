import 'reflect-metadata';
import {PATH_METADATA} from "../common/constants";
import {isUndefined} from "../common/shared.utils";

/**
 * @param prefix URL 경로
 * */
export function Controller(prefix?: string): ClassDecorator {
    const path = isUndefined(prefix) ? '/' : prefix;

    return (target: object) => {
        Reflect.defineMetadata(PATH_METADATA, path, target);
    }
}