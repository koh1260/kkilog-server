import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from '../../common/base-enttity/base.entity';
import { User } from '../../users/user.entity';
import { Post } from './post.entity';

@Entity('post_like')
export class PostLike extends BaseModel {
  @Column()
  user_id!: number;

  @Column()
  post_id!: number;

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