pipe 삭제

```shell
Errors  Files
     2  src/core/helpers/external-context-creator.ts:13
     2  src/core/router/router-execution-context.ts:19
     2  src/core/router/router-explorer.ts:26

```

### router-explorer.ts
```ts
    const pipesContextCreator = new PipesContextCreator(container, config);
    const pipesConsumer = new PipesConsumer();

this.executionContextCreator = new RouterExecutionContext(
    routeParamsFactory,
    // pipesContextCreator,
    // pipesConsumer,
    guardsContextCreator,
    guardsConsumer,
    interceptorsContextCreator,
    interceptorsConsumer,
    container.getHttpAdapterRef(),
);
```

### router-execution-context.ts

```ts
    constructor(
        private readonly paramsFactory: IRouteParamsFactory,
        // private readonly pipesContextCreator: PipesContextCreator,
        // private readonly pipesConsumer: PipesConsumer,
        private readonly guardsContextCreator: GuardsContextCreator,
        private readonly guardsConsumer: GuardsConsumer,
        private readonly interceptorsContextCreator: InterceptorsContextCreator,
        private readonly interceptorsConsumer: InterceptorsConsumer,
        readonly applicationRef: HttpServer,
    ) {
        this.responseController = new RouterResponseController(applicationRef);
    }

public create(
    instance: Controller,
    callback: (...args: any[]) => unknown,
    methodName: string,
    moduleKey: string,
    requestMethod: RequestMethod,
    contextId = STATIC_CONTEXT,
    inquirerId?: string,
)
{
    const pipes = this.pipesContextCreator.create(
        instance,
        callback,
        moduleKey,
        contextId,
        inquirerId,
    );

    const fnApplyPipes = this.createPipesFn(pipes, paramsOptions);

    const handler =
        <TRequest, TResponse>(
            args: any[],
            req: TRequest,
            res: TResponse,
            next: Function,
        ) =>
            async () => {
                // fnApplyPipes && (await fnApplyPipes(args, req, res, next));
                return callback.apply(instance, args);
            };
}

public exchangeKeysForValues(
    keys: string[],
    metadata: Record<number, RouteParamMetadata>,
    moduleContext: string,
    contextId = STATIC_CONTEXT,
    inquirerId?: string,
    contextFactory?: (args: unknown[]) => ExecutionContextHost,
): ParamProperties[] {
    this.pipesContextCreator.setModuleContext(moduleContext);

    return keys.map(key => {
        const { index, data
        //    , pipes: pipesCollection 
        } = metadata[key];
        // const pipes = this.pipesContextCreator.createConcreteContext(
        //     pipesCollection,
        //     contextId,
        //     inquirerId,
        // );
        const type = this.contextUtils.mapParamType(key);

        if (key.includes(CUSTOM_ROUTE_ARGS_METADATA)) {
            const { factory } = metadata[key];
            const customExtractValue = this.contextUtils.getCustomFactory(
                factory,
                data,
                contextFactory,
            );
            return { index, extractValue: customExtractValue, type, data, pipes };
        }
        const numericType = Number(type);
        const extractValue = <TRequest, TResponse>(
            req: TRequest,
            res: TResponse,
            next: Function,
        ) =>
            this.paramsFactory.exchangeKeyForValue(numericType, data, {
                req,
                res,
                next,
            });
        return { index, extractValue, type: numericType, data, 
        //    pipes 
        };
    });
}


public async getParamValue<T>(
    value: T,
    {
        metatype,
        type,
        data,
    }: { metatype: unknown; type: RouteParamtypes; data: unknown },
pipes: PipeTransform[],
): Promise<unknown> {
    if (!isEmpty(pipes)) {
    return this.pipesConsumer.apply(
        value,
        { metatype, type, data } as any,
        pipes,
    );
}
return value;
}
```