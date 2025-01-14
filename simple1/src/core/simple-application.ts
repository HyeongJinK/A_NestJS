// src/core/simple-application.ts
import {ModuleScanner} from "./module-scanner";

export class SimpleApplication {
    private adapter: any;
    private scanner = new ModuleScanner();

    constructor(adapter: any) {
        this.adapter = adapter;
    }

    async init(module: any) {
        const metadata = this.scanner.scan(module);

        // console.log('Controllers:', metadata.controllers);
        // console.log('Providers:', metadata.providers);
    }

    async listen(port: number) {
        this.adapter.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
}