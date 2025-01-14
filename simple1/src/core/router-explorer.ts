import 'reflect-metadata';

export class RouterExplorer {
    explore(controller: any) {
        const controllerPath = Reflect.getMetadata('path', controller.constructor);
        const routes = Object.getOwnPropertyNames(controller.__proto__)
            .filter(method => method !== 'constructor')
            .map(method => {
                const routePath = Reflect.getMetadata('path', controller[method]);
                const requestMethod = Reflect.getMetadata('method', controller[method]);
                return {
                    method: requestMethod,
                    path: `${controllerPath}/${routePath}`.replace('//', '/'),
                    handler: controller[method].bind(controller)
                };
            });
        return routes;
    }
}