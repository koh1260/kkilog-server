import { Injectable } from '@nestjs/common';
import { CategorysRepository } from './categorys-typeorm.repository';

@Injectable()
export class CategorysService {
  constructor(private readonly categoryRepository: CategorysRepository) {}

  async findAll() {
    return await this.categoryRepository.findAll();
  }
}
