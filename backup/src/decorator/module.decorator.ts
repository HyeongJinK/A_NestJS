import 'reflect-metadata';

export function Module(metadata: any): ClassDecorator {
    const propsKeys = Object.keys(metadata);    // 데코레이션을 선언할 때 전달된 메타데이터 키값

    for(const key of propsKeys) {
        console.log("Key = " +key);
        console.log("Value = " +metadata[key])
    }

    return (target: any) => {
        Reflect.defineMetadata('test3', metadata, target);
        for (const property in metadata) {
            console.log(property);
            if (metadata.hasOwnProperty(property)) {
                Reflect.defineMetadata(property, (metadata as any)[property], target);
            }
        }
    };
}