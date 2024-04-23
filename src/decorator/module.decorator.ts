import 'reflect-metadata';

export function Module(metadata: any): ClassDecorator {
    const propsKeys = Object.keys(metadata);

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