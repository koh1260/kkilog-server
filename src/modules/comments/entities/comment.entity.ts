import 'reflect-metadata';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { BaseModel } from '../../../config/typeorm/base.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity('comment')
export class Comment extends BaseModel {
  @Column({ type: 'text' })
  content!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({
    name: 'writer_id',
  })
  writer!: User;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  @JoinColumn({
    name: 'post_id',
  })
  post!: Post;

  @Column({ nullable: true })
  @JoinColumn({
    name: 'parent_id',
  })
  parent?: number;

  @ManyToMany(() => User, { cascade: true })
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
  users!: User[];

  static create(content: string, post: Post, writer: User) {
    const comment = new Comment();
    comment.content = content;
    comment.post = post;
    comment.writer = writer;

    return comment;
  }
}
