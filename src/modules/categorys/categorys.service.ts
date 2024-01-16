import { Injectable } from '@nestjs/common';
import { CategorysRepository } from './categorys.repository';
import { CategoryResponseDto } from './dto/request/category-response.dto';

@Injectable()
export class CategorysService {
  constructor(private readonly categorysRepository: CategorysRepository) {}

  async findAll() {
    return (await this.categorysRepository.findAll()).map((c) =>
      CategoryResponseDto.from(c),
    );
  }
}
