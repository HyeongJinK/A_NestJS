import type { IncomingMessage, ServerResponse } from 'http';
import type { NestExpressBodyParserOptions } from '../../interfaces';
import {RawBodyRequest} from "../../../common/interfaces";

const rawBodyParser = (
  req: RawBodyRequest<IncomingMessage>,
  _res: ServerResponse,
  buffer: Buffer,
) => {
  if (Buffer.isBuffer(buffer)) {
    req.rawBody = buffer;
  }
  return true;
};

export function getBodyParserOptions<Options = NestExpressBodyParserOptions>(
  rawBody: boolean,
  options?: Omit<Options, 'verify'> | undefined,
): Options {
  let parserOptions: Options = (options || {}) as Options;

  if (rawBody === true) {
    parserOptions = {
      ...parserOptions,
      verify: rawBodyParser,
    };
  }

  return parserOptions;
}
