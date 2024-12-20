import {SCOPE_OPTIONS_METADATA} from "../../common/constants";
import {Type} from "../../common/interfaces";

export function isDurable(provider: Type<unknown>): boolean | undefined {
  const metadata = Reflect.getMetadata(SCOPE_OPTIONS_METADATA, provider);
  return metadata && metadata.durable;
}
