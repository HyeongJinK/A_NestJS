import express from 'express';
import {PATH_METADATA} from "./common/constants";

export class SimpleApplication {
    private app = express();

    constructor(controllers: any[]) {
        controllers.forEach((controller) => {
            const path = Reflect.getMetadata(PATH_METADATA, controller);
            console.log('Controller Path:', path);

            const routes = Object.getOwnPropertyNames(controller.prototype)
                .filter(key => key !== 'constructor')
                .map(key => Object.getOwnPropertyDescriptor(controller.prototype, key))
                .filter((descriptor): descriptor is PropertyDescriptor => !!descriptor && typeof descriptor.value === 'function');

            routes.forEach((route) => {
               console.log(`Function Path : ${Reflect.getMetadata(PATH_METADATA, route.value)}`);
            });

            // TODO 라우터와 함수 매핑
        });

        // this.app.get('/', (req, res) => {
        //     res.send('Hello World');
        // });
    }

    public async listen(port: number | string, callback?: () => void) {
        console.log(`Listening on port ${port}`);
        this.app.listen(port, callback)
    }
}