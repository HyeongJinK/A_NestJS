import 'reflect-metadata';
import {metadata} from "../common/constants";
import {Logger} from "../common/services/logger.service";

const metadataKeys = [
    metadata.MODULES,
    metadata.EXPORTS,
    metadata.COMPONENTS,
    metadata.CONTROLLERS,
];

/**
 * 모듈 데코레이션에 들어온 키값이 유효한 지 검사
 * */
const validateKeys = (keys: string[]) => {
    const isKeyValid = (key: any) => metadataKeys.findIndex(k => k === key) < 0;
    const validateKey = (key: any) => {
        if (isKeyValid(key)) {
            throw new Error(`Invalid property '${key}' in @Module() decorator.`);
        }
    };
    keys.forEach(validateKey);
};

/**

 */
export function Module(obj: {
    modules?: any[],
    controllers?: any[],
    components?: any[],
    exports?: any[],
}): ClassDecorator {
    const logger = new Logger('Module Decorator', true);
    logger.log(`Module decorator is called Start`);
    const propsKeys = Object.keys(obj);
    validateKeys(propsKeys);

    return (target: object) => {
        logger.log(`target: ${target}`);
        for (const property in obj) {
            // const key = property as keyof typeof obj;를 통해 property가 obj의 키 중 하나임을 TypeScript에 명시해줍니다.
            const key = property as keyof typeof obj;
            Reflect.defineMetadata(property, obj[key], target);
            logger.log(`property: ${property}, obj[key]: ${obj[key]}`);
        }
        logger.log("Module decorator is finished");
    };
}