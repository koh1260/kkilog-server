import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '../../common/base-enttity/base.entity';
import { User } from '../../users/user.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity('comments')
export class Comment extends BaseModel {
  @Column()
  content: string;

  @ManyToOne(() => User)
  writer: User;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  constructor(content: string, writer: User, post: Post) {
    super();
    this.content = content;
    this.writer = writer;
    this.post = post;
  }
}
