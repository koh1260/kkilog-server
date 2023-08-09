import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Inject,
  ParseIntPipe,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Query,
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
import { FileInterceptor } from '@nestjs/platform-express';

// @UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(
    @Inject(PostsService)
    private readonly postsService: PostsServiceImp,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @LoginUser() user: UserInfo,
  ): Promise<CustomResponse<never>> {
    await this.postsService.createPost(createPostDto, user.id);

    return CustomResponse.create(HttpStatus.CREATED, '게시글 작성 완료.');
  }

  @Get()
  async findAll(): Promise<CustomResponse<PostEntity[]>> {
    const posts = await this.postsService.findAll();

    return CustomResponse.create(HttpStatus.OK, '게시글 전체 조회.', posts);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomResponse<PostEntity>> {
    const post = await this.postsService.findOne(id);

    return CustomResponse.create(HttpStatus.OK, '게시글 상세 조회', post);
  }

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

  @Get('/like/:postId')
  async like(
    @Param('postId', ParseIntPipe) postId: number,
    @LoginUser() { id }: UserInfo,
  ) {
    await this.postsService.like(postId, id);
  }

  @Get('/other/:postId')
  async getOtherPost(@Param('postId') id: number) {
    const posts = await this.postsService.getOtherPosts(id);
    return CustomResponse.create(
      HttpStatus.OK,
      '이전 다음 게시글 제목.',
      posts,
    );
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: Partial<UpdatePostDto>,
  ): Promise<CustomResponse<never>> {
    await this.postsService.update(id, updatePostDto);

    return CustomResponse.create(HttpStatus.NO_CONTENT, '게시글 수정 완료.');
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomResponse<never>> {
    await this.postsService.remove(id);

    return CustomResponse.create(HttpStatus.NO_CONTENT, '게시글 삭제 완료.');
  }
}
