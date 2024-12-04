import {Logger} from "../../common/services/logger.service";
import {NestContainer} from "./container";
import {Injector} from "./injector";
import {Module} from "./module";
import {Controller} from "../../common/interfaces/controllers/controller.interface";

export class InstanceLoader {
    private readonly injector = new Injector();
    private readonly logger = new Logger(InstanceLoader.name, true);

    constructor(private readonly container: NestContainer) {}

    public async createInstancesOfDependencies() {
        const modules = this.container.getModules();    // 모듈 가져오기

        // this.createPrototypes(modules);
        modules.forEach((module) => {
            this.createPrototypesOfRoutes(module);
        });

        // await this.createInstances(modules);
    }

    private createPrototypesOfRoutes(module: Module) {
        // 컨트롤 목록 반복문
        module.routes.forEach((wrapper) => {
            this.injector.loadPrototypeOfInstance<Controller>(wrapper, module.routes);
        });
    }
}