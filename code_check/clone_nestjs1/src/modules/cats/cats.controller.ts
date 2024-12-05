// import { Controller, Get, Post, Body, UseGuards, ReflectMetadata, UseInterceptors, Param } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import {Controller} from "../../common/utils/decorators/controller.decorator";
import {Body} from "../../common/utils/decorators/route-params.decorator";
import {Get, Post} from "../../common/utils/decorators/request-mapping.decorator";

@Controller('cats')
// @UseGuards(RolesGuard)
// @UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  // @Roles('admin')
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id', new ParseIntPipe()) id) {
  //   // logic
  // }
}