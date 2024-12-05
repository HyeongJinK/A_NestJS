// import { Observable } from 'rxjs/Observable';

import {Observable} from "rxjs";

export interface RpcExceptionFilter {
    catch(exception): Observable<any>;
}