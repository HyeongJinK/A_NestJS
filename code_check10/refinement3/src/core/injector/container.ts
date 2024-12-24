import { ApplicationConfig } from '../application-config';
import {
  CircularDependencyException,
  UndefinedForwardRefException,
  UnknownModuleException,
} from '../errors/exceptions';
import { InitializeOnPreviewAllowlist } from '../inspector/initialize-on-preview.allowlist';
import { REQUEST } from '../router/request/request-constants';
import { ModuleCompiler, ModuleFactory } from './compiler';
import { ContextId } from './instance-wrapper';
import { InternalProvidersStorage } from './internal-providers-storage';
import { Module } from './module';
import { ModuleTokenFactory } from './module-token-factory';
import { ModulesContainer } from './modules-container';
import {DynamicModule, Injectable, Provider, Type} from "../../common/interfaces";
import {EnhancerSubtype, GLOBAL_MODULE_METADATA} from "../../common/constants";

type ModuleMetatype = Type<any> | DynamicModule | Promise<DynamicModule>;
type ModuleScope = Type<any>[];

export class NestContainer {
  private readonly globalModules = new Set<Module>();
  private readonly moduleTokenFactory = new ModuleTokenFactory();
  private readonly moduleCompiler = new ModuleCompiler(this.moduleTokenFactory);
  private readonly modules = new ModulesContainer();
  private readonly dynamicModulesMetadata = new Map<
    string,
    Partial<DynamicModule>
  >();
  private readonly internalProvidersStorage = new InternalProvidersStorage();
  private internalCoreModule: Module;

  constructor(
    private readonly _applicationConfig: ApplicationConfig = undefined,
  ) {}

  get applicationConfig(): ApplicationConfig | undefined {
    return this._applicationConfig;
  }

  public setHttpAdapter(httpAdapter: any) {
    this.internalProvidersStorage.httpAdapter = httpAdapter;

    if (!this.internalProvidersStorage.httpAdapterHost) {
      return;
    }
    const host = this.internalProvidersStorage.httpAdapterHost;
    host.httpAdapter = httpAdapter;
  }

  public getHttpAdapterRef() {
    return this.internalProvidersStorage.httpAdapter;
  }

  public async addModule(
    metatype: ModuleMetatype,
    scope: ModuleScope,
  ): Promise<| { moduleRef: Module; inserted: boolean; } | undefined
  > {
    // In DependenciesScanner#scanForModules we already check for undefined or invalid modules
    // We still need to catch the edge-case of `forwardRef(() => undefined)`
    if (!metatype) {
      throw new UndefinedForwardRefException(scope);
    }
    const { type, dynamicMetadata, token } =
      await this.moduleCompiler.compile(metatype);
    if (this.modules.has(token)) {
      return {
        moduleRef: this.modules.get(token),
        inserted: true,
      };
    }

    return {
      moduleRef: await this.setModule(
        {
          token,
          type,
          dynamicMetadata,
        },
        scope,
      ),
      inserted: true,
    };
  }

  public async replaceModule(
    metatypeToReplace: ModuleMetatype,
    newMetatype: ModuleMetatype,
    scope: ModuleScope,
  ): Promise<
    | {
        moduleRef: Module;
        inserted: boolean;
      }
    | undefined
  > {
    // In DependenciesScanner#scanForModules we already check for undefined or invalid modules
    // We still need to catch the edge-case of `forwardRef(() => undefined)`
    if (!metatypeToReplace || !newMetatype) {
      throw new UndefinedForwardRefException(scope);
    }

    const { token } = await this.moduleCompiler.compile(metatypeToReplace);
    const { type, dynamicMetadata } =
      await this.moduleCompiler.compile(newMetatype);

    return {
      moduleRef: await this.setModule(
        {
          token,
          type,
          dynamicMetadata,
        },
        scope,
      ),
      inserted: false,
    };
  }

  private async setModule(
    { token, dynamicMetadata, type }: ModuleFactory,
    scope: ModuleScope,
  ): Promise<Module | undefined> {
    const moduleRef = new Module(type, this);
    moduleRef.token = token;
    moduleRef.initOnPreview = this.shouldInitOnPreview(type);
    this.modules.set(token, moduleRef);

    const updatedScope = [].concat(scope, type);
    await this.addDynamicMetadata(token, dynamicMetadata, updatedScope);

    if (this.isGlobalModule(type, dynamicMetadata)) {
      moduleRef.isGlobal = true;
      this.addGlobalModule(moduleRef);
    }

    return moduleRef;
  }

  public async addDynamicMetadata(
    token: string,
    dynamicModuleMetadata: Partial<DynamicModule>,
    scope: Type<any>[],
  ) {
    if (!dynamicModuleMetadata) {
      return;
    }
    this.dynamicModulesMetadata.set(token, dynamicModuleMetadata);

    const { imports } = dynamicModuleMetadata;
    await this.addDynamicModules(imports, scope);
  }

  public async addDynamicModules(modules: any[], scope: Type<any>[]) {
    if (!modules) {
      return;
    }
    await Promise.all(modules.map(module => this.addModule(module, scope)));
  }

  public isGlobalModule(
    metatype: Type<any>,
    dynamicMetadata?: Partial<DynamicModule>,
  ): boolean {
    if (dynamicMetadata && dynamicMetadata.global) {
      return true;
    }
    return !!Reflect.getMetadata(GLOBAL_MODULE_METADATA, metatype);
  }

  public addGlobalModule(module: Module) {
    this.globalModules.add(module);
  }

  public getModules(): ModulesContainer {
    return this.modules;
  }

  public getModuleByKey(moduleKey: string): Module {
    return this.modules.get(moduleKey);
  }

  public async addImport(
    relatedModule: Type<any> | DynamicModule,
    token: string,
  ) {
    if (!this.modules.has(token)) {
      return;
    }
    const moduleRef = this.modules.get(token);
    const { token: relatedModuleToken } =
      await this.moduleCompiler.compile(relatedModule);
    const related = this.modules.get(relatedModuleToken);
    moduleRef.addImport(related);
  }

  public addProvider(
    provider: Provider,
    token: string,
    enhancerSubtype?: EnhancerSubtype,
  ): string | symbol | Function {
    const moduleRef = this.modules.get(token);
    if (!provider) {
      throw new CircularDependencyException(moduleRef?.metatype.name);
    }
    if (!moduleRef) {
      throw new UnknownModuleException();
    }
    const providerKey = moduleRef.addProvider(provider, enhancerSubtype);

    return providerKey as Function;
  }

  public addInjectable(
    injectable: Provider,
    token: string,
    enhancerSubtype: EnhancerSubtype,
    host?: Type<Injectable>,
  ) {
    if (!this.modules.has(token)) {
      throw new UnknownModuleException();
    }
    const moduleRef = this.modules.get(token);
    return moduleRef.addInjectable(injectable, enhancerSubtype, host);
  }

  public addExportedProvider(provider: Type<any>, token: string) {
    if (!this.modules.has(token)) {
      throw new UnknownModuleException();
    }
    const moduleRef = this.modules.get(token);
    moduleRef.addExportedProvider(provider);
  }

  public addController(controller: Type<any>, token: string) {
    if (!this.modules.has(token)) {
      throw new UnknownModuleException();
    }
    const moduleRef = this.modules.get(token);
    moduleRef.addController(controller);
  }

  public clear() {
    this.modules.clear();
  }

  public replace(toReplace: any, options: any & { scope: any[] | null }) {
    this.modules.forEach(moduleRef => moduleRef.replace(toReplace, options));
  }

  public bindGlobalScope() {
    this.modules.forEach(moduleRef => this.bindGlobalsToImports(moduleRef));
  }

  public bindGlobalsToImports(moduleRef: Module) {
    this.globalModules.forEach(globalModule =>
      this.bindGlobalModuleToModule(moduleRef, globalModule),
    );
  }

  public bindGlobalModuleToModule(target: Module, globalModule: Module) {
    if (target === globalModule || target === this.internalCoreModule) {
      return;
    }
    target.addImport(globalModule);
  }

  public getDynamicMetadataByToken(token: string): Partial<DynamicModule>;
  public getDynamicMetadataByToken<
    K extends Exclude<keyof DynamicModule, 'global' | 'module'>,
  >(token: string, metadataKey: K): DynamicModule[K];
  public getDynamicMetadataByToken(
    token: string,
    metadataKey?: Exclude<keyof DynamicModule, 'global' | 'module'>,
  ) {
    const metadata = this.dynamicModulesMetadata.get(token);
    return metadataKey ? metadata?.[metadataKey] ?? [] : metadata;
  }

  public getModuleTokenFactory(): ModuleTokenFactory {
    return this.moduleTokenFactory;
  }

  public registerRequestProvider<T = any>(request: T, contextId: ContextId) {
    const wrapper = this.internalCoreModule.getProviderByKey(REQUEST);
    wrapper.setInstanceByContextId(contextId, {
      instance: request,
      isResolved: true,
    });
  }

  private shouldInitOnPreview(type: Type) {
    return InitializeOnPreviewAllowlist.has(type);
  }
}
