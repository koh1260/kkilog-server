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
import { CreatePostDto } from './dto/request/create-post.dto';
import { UpdatePostDto } from './dto/request/update-post.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PostsService } from './posts.service';
import { ResponseEntity } from '../../common/response/response';
import { LoginUser } from '../../common/decorators/user.decorator';
import { UserInfo } from '../../auth/jwt.strategy';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CacheControlIntercepter } from '../../common/interceptors/cache-control.intercepter';

@Controller('posts')
@UseInterceptors(CacheControlIntercepter)
@ApiTags('게시글 API')
export class PostsController {
  constructor(
    @Inject(PostsService)
    private readonly postsService: PostsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({
    summary: '게시글 등록 API',
    description: '게시글을 생성한다.',
  })
  @ApiCreatedResponse({ description: '게시글을 생성한다' })
  @ApiBearerAuth()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @LoginUser() user: UserInfo,
  ): Promise<ResponseEntity<never>> {
    await this.postsService.createPost(createPostDto, user.id);
    return ResponseEntity.create(HttpStatus.CREATED, '게시글 작성 완료.');
  }

  @Get()
  @ApiOperation({
    summary: '게시글 전체 조회 API',
    description: '게시글 목록을 조회한다.',
  })
  @ApiCreatedResponse({
    description: '게시글 목록을 조회한다',
  })
  async findAll() {
    const posts = await this.postsService.findAll();
    return ResponseEntity.create(HttpStatus.OK, '게시글 전체 조회.', posts);
  }

  @Get('category')
  @ApiOperation({
    summary: '카테고리별 게시글 목록 조회 API',
    description: '카테고리별로 게시글 목록을 조회한다.',
  })
  @ApiCreatedResponse({
    description: '카테고리별로 게시글 목록을 조회한다.',
  })
  async findByCategoryName(@Query('categoryName') categoryName: string) {
    const posts = await this.postsService.findByCategoryName(categoryName);

    return ResponseEntity.create(
      HttpStatus.OK,
      '카테고리별 게시글 조회.',
      posts,
    );
  }

  @Get('/like-count')
  @ApiOperation({
    summary: '게시글 좋아요 수 조회 API',
    description: '게시글 좋아요 수 조회 기능.',
  })
  @ApiCreatedResponse({ description: '게시글 좋아요 수 조회 기능.' })
  async likeCount(@Query('post', ParseIntPipe) postId: number) {
    const likeCount = await this.postsService.likeCount(postId);

    return ResponseEntity.create(HttpStatus.OK, '좋아요 개수.', { likeCount });
  }

  @Get(':id')
  @ApiOperation({
    summary: '게시글 조회 API',
    description: '게시글을 조회한다,',
  })
  @ApiCreatedResponse({ description: '게시글을 조회한다.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOne(id);

    return ResponseEntity.create(HttpStatus.OK, '게시글 상세 조회.', post);
  }

  @Get('category/:categoryId')
  @ApiOperation({
    summary: '카테고리별 게시글 목록 조회 API',
    description: '카테고리별로 게시글 모록을 조회한다.',
  })
  @ApiCreatedResponse({
    description: '카테고리별로 게시글 목록을 조회한다.',
  })
  async findByCategoryId(@Query('categoryName') categoryId: number) {
    const posts = await this.postsService.findByCategoryId(categoryId);

    return ResponseEntity.create(
      HttpStatus.OK,
      '카테고리별 게시글 조회.',
      posts,
    );
  }

  @Get('/like/:postId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '게시글 좋아요 API',
    description: '게시글 토글 좋아요  기능.',
  })
  @ApiCreatedResponse({ description: '게시글 토글 좋아요  기능.' })
  async like(
    @Param('postId', ParseIntPipe) postId: number,
    @LoginUser() user: UserInfo,
  ) {
    const likeCount = await this.postsService.like(postId, user.id);

    return ResponseEntity.create(HttpStatus.OK, '좋아요.', { likeCount });
  }

  @Get('/like-check/:postId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '게시글 좋아요 여부 확인 API',
    description: '게시글 좋아요 여부 확인 기능.',
  })
  @ApiCreatedResponse({ description: '게시글 좋아요 여부 확인 기능.' })
  async likeCheck(
    @Param('postId', ParseIntPipe) postId: number,
    @LoginUser() { id }: UserInfo,
  ) {
    const liked = await this.postsService.likeCheck(postId, id);

    return ResponseEntity.create(HttpStatus.OK, '좋아요 여부 확인.', { liked });
  }

  @Get('/other/:postId')
  @ApiOperation({
    summary: '이전, 다음 게시글 조회 API',
    description: '이전, 다음 게시글을 조회한다.',
  })
  @ApiCreatedResponse({
    description: '이전, 다음 게시글을 조회한다.',
  })
  async getOtherPost(@Param('postId') id: string) {
    const posts = await this.postsService.getOtherPosts(+id);
    return ResponseEntity.create(
      HttpStatus.OK,
      '이전 다음 게시글 제목.',
      posts,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '게시글 정보 수정 API',
    description: '게시글 정보를 수정한다.',
  })
  @ApiCreatedResponse({
    description: '게시글 정보를 수정한다.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @LoginUser() user: UserInfo,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<ResponseEntity<never>> {
    await this.postsService.update(id, user.id, updatePostDto);

    return ResponseEntity.create(HttpStatus.NO_CONTENT, '게시글 수정 완료.');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '게시글 삭제 API',
    description: '게시글을 삭제한다.',
  })
  @ApiCreatedResponse({
    description: '게시글을 삭제한다.',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @LoginUser() user: UserInfo,
  ): Promise<ResponseEntity<never>> {
    await this.postsService.remove(id, user.id);

    return ResponseEntity.create(HttpStatus.NO_CONTENT, '게시글 삭제 완료.');
  }
}
