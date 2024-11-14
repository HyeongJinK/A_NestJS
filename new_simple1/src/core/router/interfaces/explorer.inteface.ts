import {Metatype} from "../../../common/interfaces/metatype.interface";
import {Controller} from "../../../common/interfaces/controllers/controller.interface";

export interface RouterExplorer {
    explore(instance: Controller, metatype: Metatype<Controller>, module: string);
    fetchRouterPath(metatype: Metatype<Controller>): string;
}