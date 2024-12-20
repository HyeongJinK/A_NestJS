// import { Observable } from 'rxjs/Observable';
import { ExecutionContext } from './execution-context.interface';
import {Observable} from "rxjs";

export interface NestInterceptor {
  intercept(dataOrRequest, context: ExecutionContext, stream$: Observable<any>): Observable<any> | Promise<Observable<any>>;
}