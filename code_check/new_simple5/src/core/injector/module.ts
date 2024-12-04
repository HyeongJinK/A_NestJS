import {Metatype} from "../../common/interfaces/metatype.interface";
import {NestModuleMetatype} from "../../common/interfaces/modules/module-metatype.interface";
import {InstanceWrapper} from "./container";
import {Logger} from "../../common/services/logger.service";
import {Controller} from "../../common/interfaces/controllers/controller.interface";

export class Module {
    private logger = new Logger('Module', true);
    private _routes = new Map<string, InstanceWrapper<Controller>>();

    constructor(
        private _metatype: NestModuleMetatype,
        private _scope: NestModuleMetatype[]) {
    }

    get metatype(): NestModuleMetatype {
        return this._metatype;
    }

    public addRoute(route: Metatype<Controller>) {
        this.logger.log(`addRoute() route: ${route}`);
        this._routes.set(route.name, {
            name: route.name,
            metatype: route,
            instance: null,
            isResolved: false,
        });
    }

    get routes(): Map<string, InstanceWrapper<Controller>> {
        return this._routes;
    }
}