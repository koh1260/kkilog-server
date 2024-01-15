import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../entities/category.entity';

export class CategoryResponseDto {
  @ApiProperty()
  private readonly id: number;

  @ApiProperty()
  private readonly categoryName: string;

  @ApiProperty()
  private readonly childrenCategories: {
    id: number;
    categoryName: string;
  }[];

  constructor(category: Category) {
    this.id = category.id;
    this.categoryName = category.categoryName;
    this.childrenCategories = category.childrenCategories;
  }

  static from(category: Category) {
    return new CategoryResponseDto(category);
  }
}
