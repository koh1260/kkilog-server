import 'reflect-metadata';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { BaseModel } from '../../common/base-enttity/base.entity';
import { User } from '../../users/user.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity('comment')
export class Comment extends BaseModel {
  @Column({ type: 'text', nullable: false })
  content: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({
    name: 'writer_id',
  })
  writer: User;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  @JoinColumn({
    name: 'post_id',
  })
  post: Post;

  @Column({ nullable: true })
  @JoinColumn({
    name: 'parent_id',
  })
  parent?: number;

  @ManyToMany(() => User, { cascade: true, nullable: false })
  @JoinTable({
    name: 'comment_like',
    joinColumn: {
      name: 'comment_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users?: User[];

  setParentId(arg: number) {
    this.parent = arg;
  }

  constructor(content: string, writer: User, post: Post) {
    super();
    this.content = content;
    this.writer = writer;
    this.post = post;
  }
}
