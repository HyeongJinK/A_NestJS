export class Reflector {
  public get<T>(metadataKey: any, target: any): T {
    return Reflect.getMetadata(metadataKey, target) as T;
  }
}