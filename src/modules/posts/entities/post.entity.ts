import 'reflect-metadata';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseModel } from '../../../config/typeorm/base.entity';
import { Category } from '../../categorys/entities/category.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { PostImage } from './post-images.entity';

@Entity('post')
export class Post extends BaseModel {
  @Column({ nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: false })
  content!: string;

  @Column({
    name: 'public_scope',
    default: 'PUBLIC',
  })
  publicScope?: 'PUBLIC' | 'PRIVATE';

  @Column({ nullable: false })
  introduction!: string;

  @Column({ type: 'text', nullable: false })
  thumbnail!: string;

  @Column({ default: 0 })
  likes!: number;

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
  })
  @JoinColumn({
    name: 'writer_id',
  })
  writer!: User;

  @ManyToOne(() => Category, (category) => category.posts)
  @JoinColumn({
    name: 'category_id',
  })
  category!: Category;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments?: Comment[];

  @OneToMany(() => PostImage, (postImage) => postImage.post)
  images?: PostImage[];

  static of(
    title: string,
    content: string,
    introdution: string,
    thumbnail: string,
    writer: User,
    category: Category,
  ) {
    const post = new Post();
    post.title = title;
    post.content = content;
    post.introduction = introdution;
    post.thumbnail = thumbnail;
    post.writer = writer;
    post.category = category;

    return post;
  }
}
