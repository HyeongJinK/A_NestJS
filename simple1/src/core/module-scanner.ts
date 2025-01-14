// src/core/module-scanner.ts
import 'reflect-metadata';

export class ModuleScanner {
    scan(module: any) {
        const metadata = Reflect.getMetadata('module', module);
        console.log('Scanning Module:', metadata);
        return metadata;
    }
}