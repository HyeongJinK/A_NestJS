export const isUndefined = (obj: any): obj is undefined => typeof obj === 'undefined';
export const isFunction = (fn: any): boolean => typeof fn === 'function';
export const isObject = (fn: any): fn is object => typeof fn === 'object';
export const isString = (fn: any): fn is string => typeof fn === 'string';
export const isConstructor = (fn: any): boolean => fn === 'constructor';
export const validatePath = (path: any): string => (path.charAt(0) !== '/') ? '/' + path : path;
export const isNil = (obj: any): boolean => isUndefined(obj) || obj === null;
export const isEmpty = (array: any): boolean => !(array && array.length > 0);