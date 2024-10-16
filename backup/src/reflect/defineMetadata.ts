import {data} from "./ex";
import 'reflect-metadata';

Reflect.defineMetadata('key', '1234', data);

console.log(data);

console.log(Reflect.getMetadata('key', data)); // 1234