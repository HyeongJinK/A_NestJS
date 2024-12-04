// import { MicroserviceConfiguration } from '@nestjs/common/interfaces/microservices/microservice-configuration.interface';
// import { MicroservicesPackageNotFoundException } from './errors/exceptions/microservices-package-not-found.exception';
// import { NestApplicationContext } from './nest-application-context';
import * as optional from 'optional';

import {NestContainer} from "./injector/container";
import {InstanceLoader} from "./injector/instance-loader";
import {Logger} from "../common/services/logger.service";
import {DependenciesScanner} from "./scanner";
import {MetadataScanner} from "./metadata-scanner";
import {ExceptionsZone} from "./errors/exceptions-zone";
import {messages} from "./constants";
import {NestApplication} from "./nest-application";
import {ExpressAdapter} from "./adapters/express-adapter";
import {INestApplication} from "../common/interfaces/nest-application.interface";
import {isFunction} from "../common/utils/shared.utils";

const { NestMicroservice } = optional('@nestjs/microservices/nest-microservice') || {} as any;

export class NestFactoryStatic {
    private container = new NestContainer();
    private instanceLoader = new InstanceLoader(this.container);
    private logger = new Logger('NestFactory', true);
    private dependenciesScanner = new DependenciesScanner(
        this.container, new MetadataScanner(),
    );

    /**
     * Creates an instance of the NestApplication (returns Promise)
     *
     * @param  {} module Entry (root) application module class
     * @param  {} express Optional express() server instance
     * @returns an `Promise` of the INestApplication instance
     */
    public async create(module, express = ExpressAdapter.create()): Promise<INestApplication> {
        await this.initialize(module);
        return this.createNestInstance<NestApplication>(
            new NestApplication(this.container, express),
        );
    }

    private createNestInstance<T>(instance: T) {
        return this.createProxy(instance);
    }

    private async initialize(module) {
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


    /**
     * Creates an instance of the NestMicroservice (returns Promise)
     *
     * @param  {} module Entry (root) application module class
     * @param  {MicroserviceConfiguration} config Optional microservice configuration
     * @returns an `Promise` of the INestMicroservice instance
     */
    // public async createMicroservice(
    //     module,
    //     config?: MicroserviceConfiguration): Promise<INestMicroservice> {
    //
    //     if (!NestMicroservice) {
    //       throw new MicroservicesPackageNotFoundException();
    //     }
    //
    //     await this.initialize(module);
    //     return this.createNestInstance<INestMicroservice>(
    //         new NestMicroservice(this.container, config as any),
    //     );
    // }

    /**
     * Creates an instance of the NestApplicationContext (returns Promise)
     *
     * @param  {} module Entry (root) application module class
     * @returns an `Promise` of the INestApplicationContext instance
     */
    // public async createApplicationContext(module): Promise<INestApplicationContext> {
    //     await this.initialize(module);
    //
    //     const modules = this.container.getModules().values();
    //     const root = modules.next().value;
    //     return this.createNestInstance<INestApplicationContext>(
    //         new NestApplicationContext(this.container, [], root),
    //     );
    // }
}

export const NestFactory = new NestFactoryStatic();

