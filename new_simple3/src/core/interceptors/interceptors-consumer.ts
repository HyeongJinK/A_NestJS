import {Controller} from "../../common/interfaces/controllers/controller.interface";
import {NestInterceptor} from "../../common/interfaces/nest-interceptor.interface";


export class InterceptorsConsumer {
    public async intercept(
      interceptors: NestInterceptor[],
      dataOrRequest: any,
      instance: Controller,
      callback: (...args) => any,
      next: () => Promise<any>,
    ): Promise<any> {
        return await next();
    }
}