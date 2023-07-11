import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Inject,
  ParseIntPipe,
  UseFilters,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsServiceImp } from './posts-impl.service';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './entities/post.entity';
import { HttpExceptionFilter } from '../exception/http-exception.filter';

@UseFilters(HttpExceptionFilter)
// @UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(
    @Inject(PostsService)
    private readonly postsService: PostsServiceImp,
  ) {}

  /**
   *
   * @param createPostDto 게시글 생성을 위한 dto
   * @param req 회원 정보를 얻기 위한 Request 객체
   */
  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Request() req: any,
  ): Promise<void> {
    await this.postsService.createPost(createPostDto, req.user.email);
  }

  /**
   *
   * @returns 조회한 게시글 목록
   */
  @Get()
  async findAll(): Promise<PostEntity[]> {
    return await this.postsService.findAll();
  }

  /**
   *
   * @param id 게시글 번호
   * @returns 조회한 게시글 정보
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  /**
   *
   * @param categoryId 카테고리 번호
   * @returns 해당 카테고리의 게시글
   */
  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<PostEntity[]> {
    return this.postsService.findByCategory(categoryId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.postsService.remove(id);
  }
}
