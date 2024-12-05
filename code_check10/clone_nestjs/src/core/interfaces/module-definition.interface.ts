import {DynamicModule, ForwardReference, Type} from "../../common/interfaces";


export type ModuleDefinition =
  | ForwardReference
  | Type<unknown>
  | DynamicModule
  | Promise<DynamicModule>;
