import { BaseExceptionFilter } from './base-exception-filter';
import { InvalidExceptionFilterException } from '../errors/exceptions/invalid-exception-filter.exception';
import {HttpException} from "../../common/exceptions";
import {ArgumentsHost} from "../../common/interfaces";
import {ExceptionFilterMetadata} from "../../common/interfaces/exceptions";
import {isEmpty} from "../../common/utils/shared.utils";
import {selectExceptionFilterMetadata} from "../../common/utils/select-exception-filter-metadata.util";

export class ExceptionsHandler extends BaseExceptionFilter {
  private filters: ExceptionFilterMetadata[] = [];

  public next(exception: Error | HttpException | any, ctx: ArgumentsHost) {
    if (this.invokeCustomFilters(exception, ctx)) {
      return;
    }
    super.catch(exception, ctx);
  }

  public setCustomFilters(filters: ExceptionFilterMetadata[]) {
    if (!Array.isArray(filters)) {
      throw new InvalidExceptionFilterException();
    }
    this.filters = filters;
  }

  public invokeCustomFilters<T = any>(
    exception: T,
    ctx: ArgumentsHost,
  ): boolean {
    if (isEmpty(this.filters)) {
      return false;
    }

    const filter = selectExceptionFilterMetadata(this.filters, exception);
    filter && filter.func(exception, ctx);
    return !!filter;
  }
}