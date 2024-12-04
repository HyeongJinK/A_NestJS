import {Observable} from "rxjs";
import {ExecutionContext} from "./execution-context.interface";


export interface NestInterceptor {
  intercept(dataOrRequest, context: ExecutionContext
            , stream$: Observable<any>): Observable<any> | Promise<Observable<any>>;
}