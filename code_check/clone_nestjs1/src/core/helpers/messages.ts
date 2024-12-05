//import { RequestMethod } from '@nestjs/common/enums/request-method.enum';

import {RequestMethod} from "../../common/enums";

export const ModuleInitMessage = (module: string) => `${module} dependencies initialized`;
export const RouteMappedMessage = (path: string, method) => `Mapped {${path}, ${RequestMethod[method]}} route`;
export const ControllerMappingMessage = (name: string, path: string) => `${name} {${path}}:`;