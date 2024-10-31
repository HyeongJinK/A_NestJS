import express from 'express';
import {METHOD_METADATA, PATH_METADATA} from "./common/constants";

export class SimpleApplication {
    private app = express();

    constructor(controllers: any[]) {
        controllers.forEach((controller) => {
            const expressRoutes = express.Router()
            const path = Reflect.getMetadata(PATH_METADATA, controller);
            let controllerIn = new controller();
            console.log('Controller Path:', path);

            const routes = Object.getOwnPropertyNames(controller.prototype)
                .filter(key => key !== 'constructor')
                .map(key => Object.getOwnPropertyDescriptor(controller.prototype, key))
                .filter((descriptor): descriptor is PropertyDescriptor => !!descriptor && typeof descriptor.value === 'function');

            routes.forEach((route) => {
               console.log(`Function Path : ${Reflect.getMetadata(PATH_METADATA, route.value)}`);
               console.log(`Function Path : ${Reflect.getMetadata(METHOD_METADATA, route.value)}`);
                const method: string = Reflect.getMetadata(METHOD_METADATA, route.value);
                console.log(method)
                expressRoutes['get']('/test', controllerIn[route.value.name]);
            });

            this.app.use(expressRoutes);
        });
    }

    public async listen(port: number | string, callback?: () => void) {
        console.log(`Listening on port ${port}`);
        this.app.listen(port, callback)
    }
}