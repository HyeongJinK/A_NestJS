// import { RequestMethod } from '@nestjs/common';
// import { VersionValue } from '@nestjs/common/interfaces';

import {VersionValue} from "../../../common/interfaces";
import {RequestMethod} from "../../../common/enums";

export type HttpEntrypointMetadata = {
  path: string;
  requestMethod: keyof typeof RequestMethod;
  methodVersion?: VersionValue;
  controllerVersion?: VersionValue;
};

export type MiddlewareEntrypointMetadata = {
  path: string;
  requestMethod: keyof typeof RequestMethod;
  version?: VersionValue;
};

export type Entrypoint<T> = {
  id?: string;
  type: string;
  methodName: string;
  className: string;
  classNodeId: string;
  metadata: { key: string } & T;
};
