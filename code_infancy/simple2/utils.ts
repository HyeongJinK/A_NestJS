import { parse } from 'url';

export function parseUrl(reqUrl: string) {
  const parsedUrl = parse(reqUrl, true); // 쿼리스트링 포함
  const queryParams = parsedUrl.query || {};
  const pathname = parsedUrl.pathname || '';

  return { pathname, queryParams };
}

export function extractPathParams(routePath: string, requestPath: string) {
  const routeParts = routePath.split('/');
  const requestParts = requestPath.split('/');
  const pathParams: { [key: string]: string } = {};

  // console.log("routeParts:", routeParts);
  // console.log("requestParts:", requestParts);
  // console.log("pathParams:", pathParams);

  if (routeParts.length !== requestParts.length) return null;

  routeParts.forEach((part, i) => {
    if (part.startsWith(':')) {
      const paramName = part.slice(1);
      pathParams[paramName] = requestParts[i];
    }
  });

  return pathParams;
}