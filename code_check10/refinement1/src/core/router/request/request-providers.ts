// import { Provider, Scope } from '@nestjs/common';
import { REQUEST } from './request-constants';
import {Provider, Scope} from "../../../common/interfaces";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
export const requestProvider: Provider = {
  provide: REQUEST,
  scope: Scope.REQUEST,
  useFactory: noop,
};
