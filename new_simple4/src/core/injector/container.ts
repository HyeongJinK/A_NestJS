import 'reflect-metadata';
import {Metatype} from "../../common/interfaces/metatype.interface";
import {NestModuleMetatype} from "../../common/interfaces/modules/module-metatype.interface";
import {InvalidModuleException} from "../errors/exceptions/invalid-module.exception";
import {Module} from "./module";
import {Logger} from "../../common/services/logger.service";
import {UnknownModuleException} from "../errors/exceptions/unknown-module.exception";
import {Controller} from "../../common/interfaces/controllers/controller.interface";

export class NestContainer {
    private logger = new Logger('NestContainer', true);
    private readonly modules = new Map<string, Module>();

    public addModule(metatype: NestModuleMetatype, scope: NestModuleMetatype[]) {
        if (!metatype) {
            throw new InvalidModuleException(scope);
        }
        // 토큰 생성
        const opaqueToken = {
            module: metatype.name,
            scope: 'global',
        };
        const token = JSON.stringify(opaqueToken);
        this.logger.log(`addModule() token: ${token}`); // addModule() token: {"module":"ApplicationModule","scope":"global"}

        if (this.modules.has(token)) { // 해당 토큰을 키값으로 하는 모듈이 존재하는 지 검사
            return;
        }
        // 모듈 추가
        this.modules.set(token, new Module(metatype, scope));
    }

    public getModules(): Map<string, Module> {
        return this.modules;
    }

    public addController(controller: Metatype<Controller>, token: string) {
        if (!this.modules.has(token)) {
            throw new UnknownModuleException();
        }
        const module = this.modules.get(token);
        module && module.addRoute(controller);
    }
}

export interface InstanceWrapper<T> {
    name: any;
    metatype: Metatype<T>;
    instance: T;
    isResolved: boolean;
    isPending?: boolean;
    done$?: Promise<void>;
    inject?: Metatype<any>[];
    isNotMetatype?: boolean;
    forwardRef?: boolean;
    async?: boolean;
}