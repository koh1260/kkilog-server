import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Post } from '@prisma/client';
import { CreatePostData } from './type';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(post: CreatePostData) {
    await this.prisma.post.create({
      data: post,
    });
  }

  async findByCategoryId(categoryId: number) {
    return this.prisma.post.findMany({
      where: {
        categorie: {
          id: categoryId,
        },
      },
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
      where: {
        OR: [
          {
            categorie: {
              categoryName,
            },
          },
          {
            categorie: {
              categorie: {
                categoryName,
              },
            },
          },
        ],
      },
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

  async findOneById(id: number) {
    return await this.prisma.post.findUnique({
      where: { id },
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
            id: true,
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

  async findPrevious(id: number) {
    return await this.prisma.post.findFirst({
      where: {
        id: {
          lt: id,
        },
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findNext(id: number) {
    return await this.prisma.post.findFirst({
      where: {
        id: {
          gt: id,
        },
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async update(postId: number, data: Partial<Post>) {
    return await this.prisma.post.update({
      where: { id: postId },
      data,
    });
  }

  async delete(postId: number) {
    await this.prisma.post.delete({
      where: { id: postId },
    });
  }
}
