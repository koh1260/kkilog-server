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
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsServiceImp } from './posts-impl.service';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './entities/post.entity';

// @UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(
    @Inject(PostsService)
    private readonly postsService: PostsServiceImp,
  ) {}

  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Request() req: any,
  ): Promise<void> {
    await this.postsService.createPost(createPostDto, req.user.email);
  }

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return await this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
