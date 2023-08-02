import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { LoginUser } from '../common/decorator/user.decorator';
import { UserInfo } from '../auth/jwt.strategy';
import { CustomResponse } from '../common/response/custom-reponse';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(
    @Inject(CommentsService)
    private readonly commentsService: CommentsService,
  ) {}

  @Post()
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @LoginUser() user: UserInfo,
  ) {
    await this.commentsService.createComment(createCommentDto, user.email);
    return CustomResponse.create(HttpStatus.CREATED, '댓글 작성 완료.');
  }

  @Get()
  async findAll(@Query('post', ParseIntPipe) postId: number) {
    const comments = await this.commentsService.findAll(postId);
    return CustomResponse.create(HttpStatus.OK, '댓글 전체 조회.', comments);
  }

  @Get('/child')
  async findChildComment(@Query('parent', ParseIntPipe) parentId: number) {
    const comments = await this.commentsService.findChildComment(parentId);
    return CustomResponse.create(HttpStatus.OK, '자식 댓글 조회', comments);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @LoginUser() user: UserInfo,
  ) {
    await this.commentsService.update(id, user.email, updateCommentDto);
    return CustomResponse.create(HttpStatus.NO_CONTENT, '댓글 수정 완료.');
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @LoginUser() user: UserInfo,
  ) {
    await this.commentsService.remove(id, user.email);
    return CustomResponse.create(HttpStatus.NO_CONTENT, '댓글 삭제 완료.');
  }
}
