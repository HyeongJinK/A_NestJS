import { ExternalExceptionsHandler } from '../exceptions/external-exceptions-handler';
import { ExecutionContextHost } from '../helpers/execution-context-host';
import {ContextType} from "../../common/interfaces";

export class ExternalErrorProxy {
  public createProxy<TContext extends string = ContextType>(
    targetCallback: (...args: any[]) => any,
    exceptionsHandler: ExternalExceptionsHandler,
    type?: TContext,
  ) {
    return async (...args: any[]) => {
      try {
        return await targetCallback(...args);
      } catch (e) {
        const host = new ExecutionContextHost(args);
        host.setType<TContext>(type);
        return exceptionsHandler.next(e, host);
      }
    };
  }
}
