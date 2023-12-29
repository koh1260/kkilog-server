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
  @Column({ type: 'text', nullable: false })
  content!: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({
    name: 'writer_id',
  })
  writer?: User;

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

  @Column({ type: 'varchar', length: 10, nullable: true })
  nickname?: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  password?: string;

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

  static createMember(content: string, post: Post, writer: User) {
    const comment = new Comment();
    comment.content = content;
    comment.post = post;
    comment.writer = writer;

    return comment;
  }

  static createNonMember(
    content: string,
    post: Post,
    nikcname?: string,
    password?: string,
  ) {
    const comment = new Comment();
    comment.content = content;
    comment.post = post;
    comment.nickname = nikcname;
    comment.password = password;

    return comment;
  }
}
