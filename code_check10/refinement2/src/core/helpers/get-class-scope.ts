import {Scope, Type} from "../../common/interfaces";
import {SCOPE_OPTIONS_METADATA} from "../../common/constants";

export function getClassScope(provider: Type<unknown>): Scope {
  const metadata = Reflect.getMetadata(SCOPE_OPTIONS_METADATA, provider);
  return metadata && metadata.scope;
}
