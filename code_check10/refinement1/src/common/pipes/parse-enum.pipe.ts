import { Injectable, Optional } from '../decorators/core';
import {ArgumentMetadata, PipeTransform} from '../interfaces/features/pipe-transform.interface';
import {
  ErrorHttpStatusCode,
  HttpErrorByCode,
} from '../utils/http-error-by-code.util';
import { isNil } from '../utils/shared.utils';
import {HttpStatus} from "../enums";

/**
 * @publicApi
 */
export interface ParseEnumPipeOptions {
  optional?: boolean;
  errorHttpStatusCode?: ErrorHttpStatusCode;
  exceptionFactory?: (error: string) => any;
}

/**
 * Defines the built-in ParseEnum Pipe
 *
 * @see [Built-in Pipes](https://docs.nestjs.com/pipes#built-in-pipes)
 *
 * @publicApi
 */
@Injectable()
export class ParseEnumPipe<T = any> implements PipeTransform<T> {
  protected exceptionFactory: (error: string) => any;
  constructor(
    protected readonly enumType: T,
    @Optional() protected readonly options?: ParseEnumPipeOptions,
  ) {
    if (!enumType) {
      throw new Error(
        `"ParseEnumPipe" requires "enumType" argument specified (to validate input values).`,
      );
    }
    options = options || {};
    const { exceptionFactory, errorHttpStatusCode = HttpStatus.BAD_REQUEST } =
      options;

    this.exceptionFactory =
      exceptionFactory ||
      (error => new HttpErrorByCode[errorHttpStatusCode](error));
  }

  /**
   * Method that accesses and performs optional transformation on argument for
   * in-flight requests.
   *
   * @param value currently processed route argument
   * @param metadata contains metadata about the currently processed route argument
   */
  async transform(value: T, metadata: ArgumentMetadata): Promise<T> {
    if (isNil(value) && this.options?.optional) {
      return value;
    }
    if (!this.isEnum(value)) {
      throw this.exceptionFactory(
        'Validation failed (enum string is expected)',
      );
    }
    return value;
  }

  protected isEnum(value: T): boolean {
    const enumValues = Object.keys(this.enumType).map(
      item => this.enumType[item],
    );
    return enumValues.includes(value);
  }
}
