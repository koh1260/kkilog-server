import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from '../../../config/typeorm/base.entity';
import { User } from '../../users/user.entity';
import { Post } from './post.entity';

@Entity('post_like')
export class PostLike extends BaseModel {
  @ManyToOne(() => User, { cascade: true, eager: true })
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @ManyToOne(() => Post, { cascade: true, eager: true })
  @JoinColumn({
    name: 'post_id',
  })
  post!: Post;
}
