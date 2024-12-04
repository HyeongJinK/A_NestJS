import {Logger} from "../../common/services/logger.service";

export class HttpException {
  private readonly logger = new Logger(HttpException.name);

  /**

   * @deprecated
   */
  constructor(
      private readonly response: string | object,
      private readonly status: number,
  ) {
      this.logger.warn('DEPRECATED! Since version [4.3.2] HttpException class was moved to the @nestjs/common package!');
  }

  public getResponse(): string | object {
      return this.response;
  }

  public getStatus(): number {
      return this.status;
  }
}
