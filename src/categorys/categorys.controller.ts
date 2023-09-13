import { Controller, Get, HttpStatus } from '@nestjs/common';
import { CategorysService } from './categorys.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomResponse } from '../common/response/custom-reponse';

@Controller('categorys')
@ApiTags('카테고리 API')
@ApiBearerAuth()
export class CategorysController {
  constructor(private readonly categoryService: CategorysService) {}

  @Get()
  @ApiOperation({
    summary: '카테고리 전체 조회 API',
    description: '모든 카테고리를 조회한다',
  })
  async findAll() {
    const categorys = await this.categoryService.findAll();

    return CustomResponse.create(HttpStatus.OK, '카테고리 조회', categorys);
  }
}
