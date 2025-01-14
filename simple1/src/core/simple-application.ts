// src/core/simple-application.ts
import {ModuleScanner} from "./module-scanner";
import {RouterExplorer} from "./router-explorer";

export class SimpleApplication {
    private adapter: any;
    private scanner = new ModuleScanner();
    private routerExplorer = new RouterExplorer();

    constructor(adapter: any) {
        this.adapter = adapter;
    }

    async init(module: any) {
        const modules = this.scanner.scan(module);

        modules.forEach((mod: any) => {
            const metadata = Reflect.getMetadata('module', mod);
            const controllers = metadata.controllers || [];

            controllers.forEach((ControllerClass: any) => {
                const controllerInstance = new ControllerClass();
                const routes = this.routerExplorer.explore(controllerInstance);

                routes.forEach(route => {
                    console.log(`Mapped {${route.method}} ${route.path}`);
                });
            });
        });
    }

    async listen(port: number) {
        this.adapter.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
}