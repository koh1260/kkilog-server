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
  HttpStatus,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsServiceImp } from './posts-impl.service';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './entities/post.entity';
import { CustomResponse } from '../common/response/custom-reponse';
import { LoginUser } from '../common/decorator/user.decorator';
import { UserInfo } from '../auth/jwt.strategy';

// @UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(
    @Inject(PostsService)
    private readonly postsService: PostsServiceImp,
  ) {}

  /**
   * 게시글을 생성하는 기능.
   * @param createPostDto 게시글 생성을 위한 정보
   * @param user 로그인 시에 요청 객체에 저장된 회원 정보
   * @returns 게시글 작성 완료 메시지가 담긴 응답 객체
   */
  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @LoginUser() user: UserInfo,
  ): Promise<CustomResponse<never>> {
    await this.postsService.createPost(createPostDto, user.email);

    return CustomResponse.create(HttpStatus.CREATED, '게시글 작성 완료.');
  }

  /**
   * 모든 게시글을 조회하는 기능.
   * @returns 조회한 게시글 목록을 담은 응답 객체
   */
  @Get()
  async findAll(): Promise<CustomResponse<PostEntity[]>> {
    const posts = await this.postsService.findAll();

    return CustomResponse.create(HttpStatus.OK, '게시글 전체 조회.', posts);
  }

  /**
   * 하나의 게시글 정보를 조회하는 기능.
   * @param id 게시글 번호
   * @returns 조회한 게시글 정보를 담은 응답 객체
   */
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomResponse<PostEntity>> {
    const post = await this.postsService.findOne(id);

    return CustomResponse.create(HttpStatus.OK, '게시글 상세 조회', post);
  }

  /**
   * 카테고리 번호로 게시글을 조회하는 기능.
   * @param categoryId 카테고리 번호
   * @returns 해당 카테고리의 게시글 목록을 담은 응답 객체
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

  /**
   * 게시글의 정보를 업데이트하는 기능.
   * @param id 게시글 번호
   * @param updatePostDto 변경할 데이터
   * @returns 수정 완료 메시지를 담은 응답 객체
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: Partial<UpdatePostDto>,
  ): Promise<CustomResponse<never>> {
    await this.postsService.update(id, updatePostDto);

    return CustomResponse.create(HttpStatus.NO_CONTENT, '게시글 수정 완료.');
  }

  /**
   * 게시글을 삭제하는 기능.
   * @param id 게시글 번호
   * @returns 게시글 삭제 완료 메시지를 담은 응답 객체
   */
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomResponse<never>> {
    await this.postsService.remove(id);

    return CustomResponse.create(HttpStatus.NO_CONTENT, '게시글 삭제 완료.');
  }
}
