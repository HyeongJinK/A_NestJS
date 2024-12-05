import { INQUIRER } from './inquirer-constants';
import {Provider, Scope} from "../../../common/interfaces";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
export const inquirerProvider: Provider = {
  provide: INQUIRER,
  scope: Scope.TRANSIENT,
  useFactory: noop,
};
