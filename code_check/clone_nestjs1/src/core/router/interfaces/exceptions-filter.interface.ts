// import { Controller } from '@nestjs/common/interfaces/controllers/controller.interface';
import { ExceptionsHandler } from '../../exceptions/exceptions-handler';
import {Controller} from "../../../common/interfaces/controllers/controller.interface";

export interface ExceptionsFilter {
    create(instance: Controller, callback): ExceptionsHandler;
}