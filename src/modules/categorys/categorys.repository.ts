import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Category } from './entities/category.entity';

@Injectable()
export class CategorysRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    return await this.prisma.categorie.findMany({
      where: { parentId: null },
      select: {
        id: true,
        categoryName: true,
        childCategories: {
          select: {
            id: true,
            categoryName: true,
          },
        },
      },
    });
  }

  async findOneByName(categoryName: string) {
    return await this.prisma.categorie.findUnique({
      where: { categoryName },
    });
  }
}
