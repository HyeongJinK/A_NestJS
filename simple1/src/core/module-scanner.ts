// src/core/module-scanner.ts
import 'reflect-metadata';

export class ModuleScanner {
    scan(module: any) {
        const modules = [module];
        const metadata = Reflect.getMetadata('module', module);

        if (metadata?.imports) {
            metadata.imports.forEach((importedModule: any) => {
                modules.push(...this.scan(importedModule));
            });
        }
        return modules;
    }
}