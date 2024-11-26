import 'reflect-metadata';

import {NestContainer} from "./injector/container";
import {NestModuleMetatype} from "../common/interfaces/modules/module-metatype.interface";
import {Logger} from "../common/services/logger.service";
import {metadata} from "../common/constants";
import {Module} from "./injector/module";
import {Metatype} from "../common/interfaces/metatype.interface";
import {Controller} from "../common/interfaces/controllers/controller.interface";

export class DependenciesScanner {
    private logger = new Logger('DependenciesScanner', true);

    constructor(
        private readonly container: NestContainer) {}

    public scan(module: NestModuleMetatype) {
        this.logger.log(`scan() module: ${module}`);
        this.scanForModules(module);        // 일단 전체 모듈 가져오기
        this.scanModulesForDependencies();  // 해당 모듈에 있는 다른 의존성 가져오기
    }

    public scanForModules(module: NestModuleMetatype, scope: NestModuleMetatype[] = []) {
        this.logger.log(`scanForModules() module: ${module}`);
        this.container.addModule(module, scope);

        // 모듈 안에서 선언된 모듈 배열 가져오기
        const importedModules = this.reflectMetadata(module, metadata.MODULES); // metadata.MODULES = 'modules'
        this.logger.log(`scanForModules() importedModules: ${importedModules}`);

        // 가져온 모듈을 재귀호출
        importedModules.map((innerModule: any) => {
            this.scanForModules(innerModule, [...scope, module]);
        });
    }
    /**
     * 그 전에 가져온 모듈 목록에서 다른 의존성 가져오기
     * */
    public scanModulesForDependencies() {
        // 모듈 목록 가져오기
        const modules: Map<string, Module> = this.container.getModules();

        // 모둘 목록을 반복문으로 돌면서 의존성 가져오기
        modules.forEach(({ metatype }, token: any) => {
            this.logger.log_cyan(`scanModulesForDependencies() metatype: ${metatype}, token: ${token}`);
            this.reflectControllers(metatype, token);
        });
    }

    public reflectControllers(module: NestModuleMetatype, token: string) {
        const routes = this.reflectMetadata(module, metadata.CONTROLLERS);
        this.logger.log(`reflectControllers() routes: ${routes}`);
        routes.map((route: any) => {
            this.container.addController(route, token);
        });
    }

    public reflectMetadata(metatype: any, metadata: string) {
        return Reflect.getMetadata(metadata, metatype) || [];
    }
}