import {Logger} from "../../common/services/logger.service";
import {isObject} from "../../common/shared.utils";
import {HttpException} from "./http-exception";

export class ExceptionsHandler {
    private static readonly logger = new Logger(ExceptionsHandler.name);

    public next(exception: Error | HttpException | any, response) {
        const res = exception.getResponse();
        const message = isObject(res) ? res : ({
            statusCode: exception.getStatus(),
            message: res,
        });
        response.status(exception.getStatus()).json(message);
    }
}
