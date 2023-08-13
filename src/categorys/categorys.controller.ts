import { Controller, Get } from '@nestjs/common';
import { CategorysService } from './categorys.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('categorys')
@ApiTags('카테고리 API')
export class CategorysController {
  constructor(private readonly categoryService: CategorysService) {}

  @Get()
  @ApiOperation({
    summary: '카테고리 전체 조회 API',
    description: '모든 카테고리를 조회한다',
  })
  findAll() {
    return this.categoryService.findAll();
  }
}
