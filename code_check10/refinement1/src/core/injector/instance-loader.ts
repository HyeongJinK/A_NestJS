import { MODULE_INIT_MESSAGE } from '../helpers/messages';
import { NestContainer } from './container';
import { Injector } from './injector';
import { InternalCoreModule } from './internal-core-module/internal-core-module';
import { Module } from './module';
import {Logger, LoggerService} from "../../common/services";
import {Controller, Injectable} from "../../common/interfaces";

export class InstanceLoader<TInjector extends Injector = Injector> {
  constructor(
    protected readonly container: NestContainer,
    protected readonly injector: TInjector,
    private logger: LoggerService = new Logger(InstanceLoader.name, {
      timestamp: true,
    }),
  ) {}

  public setLogger(logger: Logger) {
    this.logger = logger;
  }

  public async createInstancesOfDependencies(
    modules: Map<string, Module> = this.container.getModules(),
  ) {
    this.createPrototypes(modules);

    try {
      await this.createInstances(modules);
    } catch (err) {
      throw err;
    }
  }

  private createPrototypes(modules: Map<string, Module>) {
    modules.forEach(moduleRef => {
      this.createPrototypesOfProviders(moduleRef);
      this.createPrototypesOfInjectables(moduleRef);
      this.createPrototypesOfControllers(moduleRef);
    });
  }

  private async createInstances(modules: Map<string, Module>) {
    await Promise.all(
      [...modules.values()].map(async moduleRef => {
        await this.createInstancesOfProviders(moduleRef);
        await this.createInstancesOfInjectables(moduleRef);
        await this.createInstancesOfControllers(moduleRef);

        const { name } = moduleRef;
        this.isModuleWhitelisted(name) &&
          this.logger.log(MODULE_INIT_MESSAGE`${name}`);
      }),
    );
  }

  private createPrototypesOfProviders(moduleRef: Module) {
    const { providers } = moduleRef;
    providers.forEach(wrapper =>
      this.injector.loadPrototype<Injectable>(wrapper, providers),
    );
  }

  private async createInstancesOfProviders(moduleRef: Module) {
    const { providers } = moduleRef;
    const wrappers = [...providers.values()];
    await Promise.all(
      wrappers.map(async item => {
        await this.injector.loadProvider(item, moduleRef);
      }),
    );
  }

  private createPrototypesOfControllers(moduleRef: Module) {
    const { controllers } = moduleRef;
    controllers.forEach(wrapper =>
      this.injector.loadPrototype<Controller>(wrapper, controllers),
    );
  }

  private async createInstancesOfControllers(moduleRef: Module) {
    const { controllers } = moduleRef;
    const wrappers = [...controllers.values()];
    await Promise.all(
      wrappers.map(async item => {
        await this.injector.loadController(item, moduleRef);
      }),
    );
  }

  private createPrototypesOfInjectables(moduleRef: Module) {
    const { injectables } = moduleRef;
    injectables.forEach(wrapper =>
      this.injector.loadPrototype(wrapper, injectables),
    );
  }

  private async createInstancesOfInjectables(moduleRef: Module) {
    const { injectables } = moduleRef;
    const wrappers = [...injectables.values()];
    await Promise.all(
      wrappers.map(async item => {
        await this.injector.loadInjectable(item, moduleRef);
      }),
    );
  }

  private isModuleWhitelisted(name: string): boolean {
    return name !== InternalCoreModule.name;
  }
}
