//import { RequestMethod } from '@nestjs/common/enums/request-method.enum';

import {RequestMethod} from "../../common/enums";

export class RouterMethodFactory {
    public get(target, requestMethod: RequestMethod) {
        switch (requestMethod) {
            case RequestMethod.POST: return target.post;
            case RequestMethod.ALL: return target.all;
            case RequestMethod.DELETE: return target.delete;
            case RequestMethod.PUT: return target.put;
            case RequestMethod.PATCH: return target.patch;
            case RequestMethod.OPTIONS: return target.options;
            case RequestMethod.HEAD: return target.head;
            default: {
                return target.get;
            }
        }
    }
}