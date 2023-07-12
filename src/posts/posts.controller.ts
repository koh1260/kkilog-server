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
  HttpStatus,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsServiceImp } from './posts-impl.service';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './entities/post.entity';
import { HttpExceptionFilter } from '../exception/http-exception.filter';
import { CustomResponse } from '../common/response/custom-reponse';

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
  ): Promise<CustomResponse<never>> {
    await this.postsService.createPost(createPostDto, req.user.email);

    return CustomResponse.create(HttpStatus.CREATED, '게시글 작성 완료.');
  }

  /**
   *
   * @returns 조회한 게시글 목록
   */
  @Get()
  async findAll(): Promise<CustomResponse<PostEntity[]>> {
    const posts = await this.postsService.findAll();

    return CustomResponse.create(HttpStatus.OK, '게시글 전체 조회.', posts);
  }

  /**
   *
   * @param id 게시글 번호
   * @returns 조회한 게시글 정보
   */
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomResponse<PostEntity>> {
    const post = await this.postsService.findOne(id);

    return CustomResponse.create(HttpStatus.OK, '게시글 상세 조회', post);
  }

  /**
   *
   * @param categoryId 카테고리 번호
   * @returns 해당 카테고리의 게시글
   */
  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<CustomResponse<PostEntity[]>> {
    const posts = await this.postsService.findByCategory(categoryId);

    return CustomResponse.create(
      HttpStatus.OK,
      '카테고리별 게시글 조회.',
      posts,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomResponse<never>> {
    this.postsService.remove(id);

    return CustomResponse.create(HttpStatus.NO_CONTENT, '게시글 삭제 완료.');
  }
}
