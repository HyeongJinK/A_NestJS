import { ExternalExceptionFilter } from './external-exception-filter';
import { InvalidExceptionFilterException } from '../errors/exceptions/invalid-exception-filter.exception';
import {ExceptionFilterMetadata} from "../../common/interfaces/exceptions";
import {ArgumentsHost} from "../../common/interfaces";
import {selectExceptionFilterMetadata} from "../../common/utils/select-exception-filter-metadata.util";
import {isEmpty} from "../../common/utils/shared.utils";

export class ExternalExceptionsHandler extends ExternalExceptionFilter {
  private filters: ExceptionFilterMetadata[] = [];

  public next(exception: Error | any, host: ArgumentsHost): Promise<any> {
    const result = this.invokeCustomFilters(exception, host);
    if (result) {
      return result;
    }
    return super.catch(exception, host);
  }

  public setCustomFilters(filters: ExceptionFilterMetadata[]) {
    if (!Array.isArray(filters)) {
      throw new InvalidExceptionFilterException();
    }
    this.filters = filters;
  }

  public invokeCustomFilters<T = any>(
    exception: T,
    host: ArgumentsHost,
  ): Promise<any> | null {
    if (isEmpty(this.filters)) {
      return null;
    }

    const filter = selectExceptionFilterMetadata(this.filters, exception);
    return filter ? filter.func(exception, host) : null;
  }
}
