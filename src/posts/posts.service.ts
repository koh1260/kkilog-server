import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

export interface PostsService {
  createPost(createPostDto: CreatePostDto, email: string): Promise<Post>;
  findAll(): Promise<Post[]>;
  findOne(id: number): Promise<Post>;
  findByCategory(categoryId: number): Promise<Post[]>;
  update(id: number, updatePostDto: UpdatePostDto): Promise<Post>;
  remove(id: number);
}
export const PostsService = Symbol('PostsService');
