// import { isFunction } from '@nestjs/common/utils/shared.utils';
// import { Metatype } from '@nestjs/common/interfaces';

import {Metatype} from "../../common/interfaces/metatype.interface";
import {isFunction} from "../../common/utils/shared.utils";

let id = 1;

export const filterMiddlewares = (middlewares) => {
    return [].concat(middlewares)
        .filter(isFunction)
        .map((middleware) => mapToClass(middleware));
};

export const mapToClass = (middleware) => {
    if (isClass(middleware)) {
        return middleware;
    }
    return assignToken(class {
        public resolve = (...args) => (req, res, next) => middleware(req, res, next);
    });
};

export const isClass = (middleware) => {
    return middleware.toString().substring(0, 5) === 'class';
};

export const assignToken = (metatype): Metatype<any> => {
    id = id || 1;
    Object.defineProperty(metatype, 'name', { value: ++id });
    return metatype;
};