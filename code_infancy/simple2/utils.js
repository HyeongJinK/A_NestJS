"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUrl = parseUrl;
exports.extractPathParams = extractPathParams;
const url_1 = require("url");
function parseUrl(reqUrl) {
    const parsedUrl = (0, url_1.parse)(reqUrl, true); // 쿼리스트링 포함
    const queryParams = parsedUrl.query || {};
    const pathname = parsedUrl.pathname || '';
    return { pathname, queryParams };
}
function extractPathParams(routePath, requestPath) {
    const routeParts = routePath.split('/');
    const requestParts = requestPath.split('/');
    const pathParams = {};
    if (routeParts.length !== requestParts.length)
        return null;
    routeParts.forEach((part, i) => {
        if (part.startsWith(':')) {
            const paramName = part.slice(1);
            pathParams[paramName] = requestParts[i];
        }
    });
    return pathParams;
}
