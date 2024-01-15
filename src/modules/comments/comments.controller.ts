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
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { LoginUser } from '../../common/decorators/user.decorator';
import { UserInfo } from '../../auth/jwt.strategy';
import { ResponseEntity } from '../../common/response/response';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CommentsResponseDto } from './dto/response/comment-response.dto';

@Controller('comments')
@ApiTags('댓글 API')
@ApiBearerAuth()
export class CommentsController {
  constructor(
    @Inject(CommentsService)
    private readonly commentsService: CommentsService,
  ) {}

  /**
  TODO
  userId를 받지 않고, token에서 추출하도록 수정 예정.
   */
  @Post()
  @ApiOperation({ summary: '댓글 작성 API', description: '댓글을 작성한다.' })
  @ApiCreatedResponse({ description: '댓글을 작성한다.' })
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    await this.commentsService.createComment(createCommentDto);
    return ResponseEntity.create(HttpStatus.CREATED, '댓글 작성 완료.');
  }

  @Get()
  @ApiOperation({
    summary: '특정 게시글 댓글 전체 조회 API',
    description: '특정 게시글의 모든 댓글을 조회한다.',
  })
  @ApiCreatedResponse({
    description: '특정 게시글의 모든 댓글을 조회한다.',
    type: [ResponseEntity<CommentsResponseDto[]>],
  })
  async findAll(@Query('post', ParseIntPipe) postId: number) {
    const comments = await this.commentsService.findAll(postId);
    return ResponseEntity.create(HttpStatus.OK, '댓글 전체 조회.', comments);
  }

  @Get('/child')
  @ApiOperation({
    summary: '자식 댓글 조회 API',
    description: '특정 댓글의 자식 댓글을 조회한다.',
  })
  @ApiCreatedResponse({
    description: '특정 댓글의 자식 댓글을 조회한다.',
  })
  async findChildComment(@Query('parent', ParseIntPipe) parentId: number) {
    const comments = await this.commentsService.findChildComment(parentId);
    return ResponseEntity.create(HttpStatus.OK, '자식 댓글 조회', comments);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '댓글 수정 API', description: '댓글을 수정한다.' })
  @ApiCreatedResponse({ description: '댓글을 수정한다.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @LoginUser() user: UserInfo,
  ) {
    await this.commentsService.update(id, user.id, updateCommentDto);
    return ResponseEntity.create(HttpStatus.OK, '댓글 수정 완료.');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '댓글 삭제 API', description: '댓글을 삭제한다.' })
  @ApiCreatedResponse({ description: '댓글을 삭제한다.' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @LoginUser() user: UserInfo,
  ) {
    await this.commentsService.remove(id, user.id);
    return ResponseEntity.create(HttpStatus.OK, '댓글 삭제 완료.');
  }
}
