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
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';

// @UseGuards(JwtAuthGuard)
@Controller('comments')
@ApiTags('댓글 API')
export class CommentsController {
  constructor(
    @Inject(CommentsService)
    private readonly commentsService: CommentsService,
  ) {}

  @Post()
  @ApiOperation({ summary: '댓글 작성 API', description: '댓글을 작성한다.' })
  @ApiCreatedResponse({ description: '댓글을 작성한다.', type: Comment })
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @LoginUser() user: UserInfo,
  ) {
    await this.commentsService.createComment(createCommentDto, user.id);
    return CustomResponse.create(HttpStatus.CREATED, '댓글 작성 완료.');
  }

  @Get()
  @ApiOperation({
    summary: '특정 게시글 댓글 전체 조회 API',
    description: '특정 게시글의 모든 댓글을 조회한다.',
  })
  @ApiCreatedResponse({
    description: '특정 게시글의 모든 댓글을 조회한다.',
    type: [Comment],
  })
  async findAll(@Query('post', ParseIntPipe) postId: number) {
    const comments = await this.commentsService.findAll(postId);
    return CustomResponse.create(HttpStatus.OK, '댓글 전체 조회.', comments);
  }

  @Get('/child')
  @ApiOperation({
    summary: '자식 댓글 조회 API',
    description: '특정 댓글의 자식 댓글을 조회한다.',
  })
  @ApiCreatedResponse({
    description: '특정 댓글의 자식 댓글을 조회한다.',
    type: [Comment],
  })
  async findChildComment(@Query('parent', ParseIntPipe) parentId: number) {
    const comments = await this.commentsService.findChildComment(parentId);
    return CustomResponse.create(HttpStatus.OK, '자식 댓글 조회', comments);
  }

  @Patch(':id')
  @ApiOperation({ summary: '댓글 수정 API', description: '댓글을 수정한다.' })
  @ApiCreatedResponse({ description: '댓글을 수정한다.', type: Comment })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @LoginUser() user: UserInfo,
  ) {
    await this.commentsService.update(id, user.email, updateCommentDto);
    return CustomResponse.create(HttpStatus.NO_CONTENT, '댓글 수정 완료.');
  }

  @Delete(':id')
  @ApiOperation({ summary: '댓글 삭제 API', description: '댓글을 삭제한다.' })
  @ApiCreatedResponse({ description: '댓글을 삭제한다.', type: Comment })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @LoginUser() user: UserInfo,
  ) {
    await this.commentsService.remove(id, user.email);
    return CustomResponse.create(HttpStatus.NO_CONTENT, '댓글 삭제 완료.');
  }
}
