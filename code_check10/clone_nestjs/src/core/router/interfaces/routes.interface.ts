// import { Type } from '@nestjs/common';

import {Type} from "../../../common/interfaces";

export interface RouteTree {
  path: string;
  module?: Type<any>;
  children?: (RouteTree | Type<any>)[];
}

export type Routes = RouteTree[];
