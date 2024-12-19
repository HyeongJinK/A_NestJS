// import { RequestMethod } from '@nestjs/common';
// import { addLeadingSlash } from '@nestjs/common/utils/shared.utils';
import { ExcludeRouteMetadata } from '../interfaces/exclude-route-metadata.interface';
import {RequestMethod} from "../../../common/enums";
import {addLeadingSlash} from "../../../common/utils/shared.utils";

export const isRequestMethodAll = (method: RequestMethod) => {
  return RequestMethod.ALL === method || (method as number) === -1;
};

export function isRouteExcluded(
  excludedRoutes: ExcludeRouteMetadata[],
  path: string,
  requestMethod?: RequestMethod,
) {
  return excludedRoutes.some(route => {
    if (
      isRequestMethodAll(route.requestMethod) ||
      route.requestMethod === requestMethod
    ) {
      return route.pathRegex.exec(addLeadingSlash(path));
    }
    return false;
  });
}
