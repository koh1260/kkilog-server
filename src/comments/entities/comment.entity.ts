import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../../common/base-enttity/base.entity';
import { User } from '../../users/user.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class Comment extends BaseModel {
  @Column()
  content: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  constructor(content: string, user: User, post: Post) {
    super();
    this.content = content;
    this.user = user;
    this.post = post;
  }
}
