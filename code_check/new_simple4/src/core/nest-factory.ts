import {Logger} from "../common/services/logger.service";
import {DependenciesScanner} from "./scanner";
import {ExceptionsZone} from "./errors/exceptions-zone";
import {NestContainer} from "./injector/container";
import {messages} from "./constants";
import {ExpressAdapter} from "./adapters/express-adapter";
import {InstanceLoader} from "./injector/instance-loader";
import {INestApplication} from "../common/interfaces/nest-application.interface";
import {NestApplication} from "./nest-application";
import {isFunction} from "../common/shared.utils";

export class NestFactoryStatic {
    private container = new NestContainer();
    private logger = new Logger('NestFactory', true);
    private dependenciesScanner = new DependenciesScanner(this.container);
    private instanceLoader = new InstanceLoader(this.container);

    /**
     */
    public async create(module: any, express = ExpressAdapter.create()): Promise<INestApplication> {
        this.logger.log(`create() parameter module: ${module}`);
        await this.initialize(module);
        return this.createNestInstance<NestApplication>(
            new NestApplication(this.container, express),
        );

    }

    private async initialize(module: any) {
        try {
            this.logger.log(messages.APPLICATION_START);
            await ExceptionsZone.asyncRun(async () => {
                this.dependenciesScanner.scan(module);
                await this.instanceLoader.createInstancesOfDependencies();
            });
        }
        catch (e) {
            process.abort();
        }
    }

    /**
     * Creates NestApplication
     */
    private createNestInstance<T>(instance: T) {
        return this.createProxy(instance);
    }

    private createProxy(target) {
        const proxy = this.createExceptionProxy();
        return new Proxy(target, {
            get: proxy,
            set: proxy,
        });
    }

    private createExceptionProxy() {
        return (receiver, prop) => {
            if (!(prop in receiver))
                return;

            if (isFunction(receiver[prop])) {
                return (...args) => {
                    let result;
                    ExceptionsZone.run(() => {
                        result = receiver[prop](...args);
                    });
                    return result;
                };
            }
            return receiver[prop];
        };
    }
}

export const NestFactory = new NestFactoryStatic();

