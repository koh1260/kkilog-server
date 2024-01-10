import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PostsPrismaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCategoryId(categoryId: number) {
    return this.prisma.post.findMany({
      where: { categoryId },
      select: {
        id: true,
        title: true,
        introduction: true,
        thumbnail: true,
        createAt: true,
        likes: true,
        _count: {
          select: { comment: true },
        },
      },
      orderBy: {
        createAt: 'desc',
      },
    });
  }

  async findByCategoryName(categoryName: string) {
    return this.prisma.post.findMany({
      select: {
        id: true,
        title: true,
        introduction: true,
        thumbnail: true,
        createAt: true,
        likes: true,
        _count: {
          select: { comment: true },
        },
        categorie: {
          where: { categoryName },
        },
      },
      orderBy: {
        createAt: 'desc',
      },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      select: {
        id: true,
        title: true,
        introduction: true,
        thumbnail: true,
        createAt: true,
        likes: true,
        _count: {
          select: { comment: true },
        },
      },
      orderBy: {
        createAt: 'desc',
      },
    });
  }

  async findDetailById(id: number) {
    return await this.prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        thumbnail: true,
        introduction: true,
        publicScope: true,
        createAt: true,
        likes: true,
        categorie: {
          select: {
            categoryName: true,
          },
        },
        user: {
          select: {
            nickname: true,
            profileImage: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            createAt: true,
            user: {
              select: {
                nickname: true,
                profileImage: true,
              },
            },
          },
        },
      },
    });
  }
}
