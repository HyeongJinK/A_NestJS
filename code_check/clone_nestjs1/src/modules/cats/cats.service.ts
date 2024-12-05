import { Cat } from './interfaces/cat.interface';
import { CatsModule } from './cats.module';
import {Component} from "../../common/utils/decorators/component.decorator";

@Component()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}