import { ExternalExceptionFilterContext } from '../exceptions/external-exception-filter-context';
import { GuardsConsumer, GuardsContextCreator } from '../guards';
import { NestContainer } from '../injector/container';
import { ModulesContainer } from '../injector/modules-container';
import {
  InterceptorsConsumer,
  InterceptorsContextCreator,
} from '../interceptors';
import { ContextUtils } from './context-utils';
import { ExternalErrorProxy } from './external-proxy';
import { HandlerMetadataStorage } from './handler-metadata-storage';
import { ExternalHandlerMetadata } from './interfaces/external-handler-metadata.interface';

export class ExternalContextCreator {
  private readonly contextUtils = new ContextUtils();
  private readonly externalErrorProxy = new ExternalErrorProxy();
  private readonly handlerMetadataStorage =
    new HandlerMetadataStorage<ExternalHandlerMetadata>();
  private container: NestContainer;

  constructor(
    private readonly guardsContextCreator: GuardsContextCreator,
    private readonly guardsConsumer: GuardsConsumer,
    private readonly interceptorsContextCreator: InterceptorsContextCreator,
    private readonly interceptorsConsumer: InterceptorsConsumer,
    private readonly modulesContainer: ModulesContainer,
    private readonly filtersContextCreator: ExternalExceptionFilterContext,
  ) {}

  static fromContainer(container: NestContainer): ExternalContextCreator {
    const guardsContextCreator = new GuardsContextCreator(
      container,
      container.applicationConfig,
    );
    const guardsConsumer = new GuardsConsumer();
    const interceptorsContextCreator = new InterceptorsContextCreator(
      container,
      container.applicationConfig,
    );
    const interceptorsConsumer = new InterceptorsConsumer();
    const filtersContextCreator = new ExternalExceptionFilterContext(
      container,
      container.applicationConfig,
    );

    const externalContextCreator = new ExternalContextCreator(
      guardsContextCreator,
      guardsConsumer,
      interceptorsContextCreator,
      interceptorsConsumer,
      container.getModules(),
      filtersContextCreator,
    );
    externalContextCreator.container = container;
    return externalContextCreator;
  }
}
