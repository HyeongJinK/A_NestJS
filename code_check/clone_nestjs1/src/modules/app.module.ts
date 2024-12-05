// import { Module, NestModule, MiddlewaresConsumer } from '@nestjs/common';
// import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { CatsModule } from './cats/cats.module';
import { CatsController } from './cats/cats.controller';

import {NestModule} from "../common/interfaces/modules/nest-module.interface";
import {Module} from "../common/utils/decorators/module.decorator";
import {MiddlewaresConsumer} from "../common/interfaces/middlewares/middlewares-consumer.interface";

@Module({
    modules: [CatsModule],
})
export class ApplicationModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        // consumer.apply(LoggerMiddleware)
        //     .with('ApplicationModule')
        //     .forRoutes(CatsController);
    }
}