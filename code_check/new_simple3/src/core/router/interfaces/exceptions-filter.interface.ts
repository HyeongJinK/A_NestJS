import {Controller} from "../../../common/interfaces/controllers/controller.interface";
import {ExceptionsHandler} from "../../exceptions/exceptions-handler";

export interface ExceptionsFilter {
    create(instance: Controller, callback): ExceptionsHandler;
}