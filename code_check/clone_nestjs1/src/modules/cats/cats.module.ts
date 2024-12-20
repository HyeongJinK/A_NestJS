// import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import {Module} from "../../common/utils/decorators/module.decorator";

@Module({
    controllers: [CatsController],
    components: [CatsService],
})
export class CatsModule {}