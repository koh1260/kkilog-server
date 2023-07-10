import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CustomRepository } from '../common/custom-repository';

@CustomRepository(Post)
export class PostsRepository extends Repository<Post> {}
