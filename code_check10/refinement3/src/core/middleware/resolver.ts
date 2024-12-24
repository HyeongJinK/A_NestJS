import { Injector } from '../injector/injector';
import { InstanceWrapper } from '../injector/instance-wrapper';
import { Module } from '../injector/module';
import { MiddlewareContainer } from './container';
import {InjectionToken} from "../../common/interfaces";

export class MiddlewareResolver {
  constructor(
    private readonly middlewareContainer: MiddlewareContainer,
    private readonly injector: Injector,
  ) {}

  public async resolveInstances(moduleRef: Module, moduleName: string) {
    const middlewareMap =
      this.middlewareContainer.getMiddlewareCollection(moduleName);
    const resolveInstance = async (wrapper: InstanceWrapper) =>
      this.resolveMiddlewareInstance(wrapper, middlewareMap, moduleRef);
    await Promise.all([...middlewareMap.values()].map(resolveInstance));
  }

  private async resolveMiddlewareInstance(
    wrapper: InstanceWrapper,
    middlewareMap: Map<InjectionToken, InstanceWrapper>,
    moduleRef: Module,
  ) {
    await this.injector.loadMiddleware(wrapper, middlewareMap, moduleRef);
  }
}
