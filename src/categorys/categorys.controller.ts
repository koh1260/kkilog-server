import { Controller, Get } from '@nestjs/common';
import { CategorysService } from './categorys.service';

@Controller('categorys')
export class CategorysController {
  constructor(private readonly categoryService: CategorysService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }
}
