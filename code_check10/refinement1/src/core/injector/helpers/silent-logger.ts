import {Logger} from "../../../common/services";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
export class SilentLogger extends Logger {
  log = noop;
  error = noop;
  warn = noop;
  debug = noop;
  verbose = noop;
  fatal = noop;
  setLogLevels = noop;
}
