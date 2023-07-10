import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

export interface PostsService {
  createPost(createPostDto: CreatePostDto, email: string): Promise<void>;
  existUser(user: User);
  findAll(): Promise<Post[]>;
  findOne(id: number);
  update(id: number, updatePostDto: UpdatePostDto);
  remove(id: number);
}
export const PostsService = Symbol('PostsService');
