import {RequestMethod} from "../../common/enums";
import {VERSION_NEUTRAL, VersionValue} from "../../common/interfaces";

export const MODULE_INIT_MESSAGE = (
  text: TemplateStringsArray,
  module: string,
) => `${module} dependencies initialized`;

export const ROUTE_MAPPED_MESSAGE = (path: string, method: string | number) =>
  `Mapped {${path}, ${RequestMethod[method]}} route`;

export const VERSIONED_ROUTE_MAPPED_MESSAGE = (
  path: string,
  method: string | number,
  version: VersionValue,
) => {
  const controllerVersions = Array.isArray(version) ? version : [version];
  const versions = controllerVersions
    .map(version => (version === VERSION_NEUTRAL ? 'Neutral' : version))
    .join(',');

  return `Mapped {${path}, ${RequestMethod[method]}} (version: ${versions}) route`;
};

export const CONTROLLER_MAPPING_MESSAGE = (name: string, path: string) =>
  `${name} {${path}}:`;

export const VERSIONED_CONTROLLER_MAPPING_MESSAGE = (
  name: string,
  path: string,
  version: VersionValue,
) => {
  const controllerVersions = Array.isArray(version) ? version : [version];
  const versions = controllerVersions
    .map(version => (version === VERSION_NEUTRAL ? 'Neutral' : version))
    .join(',');

  return `${name} {${path}} (version: ${versions}):`;
};
