// app.ts
import express from 'express';
import { container } from './container';
import { Controller } from './decorators';

export class Application {
  private app = express();

  public bootstrap(controllers: any[]) {
    controllers.forEach((ControllerClass) => {
      const controllerInstance = new ControllerClass();
      const prefix = Reflect.getMetadata('prefix', ControllerClass);
      const routes = Reflect.getMetadata('routes', ControllerClass);

      routes.forEach((route) => {
        this.app[route.method](
          prefix + route.path,
          controllerInstance[route.handlerName].bind(controllerInstance)
        );
      });
    });
  }

  public listen(port: number, callback: () => void) {
    this.app.listen(port, callback);
  }
}
