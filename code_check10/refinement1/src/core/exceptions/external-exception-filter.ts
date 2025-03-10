import {ArgumentsHost} from "../../common/interfaces";
import {Logger} from "../../common/services";
import {HttpException} from "../../common/exceptions";

export class ExternalExceptionFilter<T = any, R = any> {
  private static readonly logger = new Logger('ExceptionsHandler');

  catch(exception: T, host: ArgumentsHost): R | Promise<R> {
    if (exception instanceof Error && !(exception instanceof HttpException)) {
      ExternalExceptionFilter.logger.error(exception.message, exception.stack);
    }
    throw exception;
  }
}
