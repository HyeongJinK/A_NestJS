import { ExceptionHandler } from './exception-handler';
import { RuntimeException } from './exceptions/runtime.exception';
import { UNHANDLED_RUNTIME_EXCEPTION } from './messages';

export class ExceptionsZone {
    private static readonly exceptionHandler = new ExceptionHandler();

    public static run(fn: () => void) {
        try {
            fn();
        }
        catch (e: any) {
            this.exceptionHandler.handle(e);
            throw UNHANDLED_RUNTIME_EXCEPTION;
        }
    }

    public static async asyncRun(fn: () => Promise<void>) {
        try {
            await fn();
        }
        catch (e: any) {
            this.exceptionHandler.handle(e);
            throw UNHANDLED_RUNTIME_EXCEPTION;
        }
    }
}