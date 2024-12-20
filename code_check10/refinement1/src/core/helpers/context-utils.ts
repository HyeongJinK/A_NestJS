import { ExecutionContextHost } from './execution-context-host';
import {ParamData} from "../../common/decorators";
import {ContextType, Controller, PipeTransform, Type} from "../../common/interfaces";
import {PARAMTYPES_METADATA, RESPONSE_PASSTHROUGH_METADATA} from "../../common/constants";
import {isFunction} from "../../common/utils/shared.utils";

export interface ParamProperties<T = any, IExtractor extends Function = any> {
  index: number;
  type: T | string;
  data: ParamData;
  pipes: PipeTransform[];
  extractValue: IExtractor;
}

export class ContextUtils {
  public mapParamType(key: string): string {
    const keyPair = key.split(':');
    return keyPair[0];
  }

  public reflectCallbackParamtypes(
    instance: Controller,
    methodName: string,
  ): any[] {
    return Reflect.getMetadata(PARAMTYPES_METADATA, instance, methodName);
  }

  public reflectCallbackMetadata<T = any>(
    instance: Controller,
    methodName: string,
    metadataKey: string,
  ): T {
    return Reflect.getMetadata(metadataKey, instance.constructor, methodName);
  }

  public reflectPassthrough(instance: Controller, methodName: string): boolean {
    return Reflect.getMetadata(
      RESPONSE_PASSTHROUGH_METADATA,
      instance.constructor,
      methodName,
    );
  }

  public getArgumentsLength<T>(keys: string[], metadata: T): number {
    return keys.length
      ? Math.max(...keys.map(key => metadata[key].index)) + 1
      : 0;
  }

  public createNullArray(length: number): any[] {
    const a = new Array(length);
    for (let i = 0; i < length; ++i) a[i] = undefined;
    return a;
  }

  public mergeParamsMetatypes(
    paramsProperties: ParamProperties[],
    paramtypes: any[],
  ): (ParamProperties & { metatype?: any })[] {
    if (!paramtypes) {
      return paramsProperties;
    }
    return paramsProperties.map(param => ({
      ...param,
      metatype: paramtypes[param.index],
    }));
  }

  public getCustomFactory(
    factory: (...args: unknown[]) => void,
    data: unknown,
    contextFactory: (args: unknown[]) => ExecutionContextHost,
  ): (...args: unknown[]) => unknown {
    return isFunction(factory)
      ? (...args: unknown[]) => factory(data, contextFactory(args))
      : () => null;
  }

  public getContextFactory<TContext extends string = ContextType>(
    contextType: TContext,
    instance?: object,
    callback?: Function,
  ): (args: unknown[]) => ExecutionContextHost {
    const type = instance && (instance.constructor as Type<unknown>);
    return (args: unknown[]) => {
      const ctx = new ExecutionContextHost(args, type, callback);
      ctx.setType(contextType);
      return ctx;
    };
  }
}
