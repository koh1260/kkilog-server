import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentData, UpdateCommentData } from './type';

@Injectable()
export class CommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCommentData) {
    await this.prisma.comment.create({
      data,
    });
  }

  async findAll(postId: number) {
    return await this.prisma.comment.findMany({
      where: { postId, parent: null },
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
    });
  }

  async findOneById(id: number) {
    return await this.prisma.comment.findUnique({
      where: { id },
    });
  }

  async findChildCommentByParentId(parentId: number) {
    return await this.prisma.comment.findMany({
      where: { parent: parentId },
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
    });
  }

  async update(data: UpdateCommentData) {
    const { id, ...rest } = data;
    await this.prisma.comment.update({
      where: { id },
      data: { ...rest },
    });
  }

  async delete(id: number) {
    await this.prisma.comment.delete({
      where: { id },
    });
  }
}
