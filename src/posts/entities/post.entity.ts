import 'reflect-metadata';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { BaseModel } from '../../common/base-enttity/base.entity';
import { Category } from '../../categorys/entities/category.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { PostImage } from './post-images.entity';

@Entity('post')
export class Post extends BaseModel {
  @Column({ length: 30 })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({
    name: 'public_scope',
    default: 'PUBLIC',
  })
  publicScope?: 'PUBLIC' | 'PRIVATE';

  @Column({ length: 200, nullable: false })
  introduction: string;

  @Column({ type: 'text', nullable: false })
  thumbnail: string;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  @JoinColumn({
    name: 'writer_id',
  })
  writer: User;

  @ManyToOne(() => Category, (category) => category.posts)
  @JoinColumn({
    name: 'category_id',
  })
  category: Category;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments?: Comment[];

  @OneToMany(() => PostImage, (postImage) => postImage.post)
  images?: PostImage[];

  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: 'post_like',
    joinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users?: User[];

  constructor(
    title: string,
    content: string,
    introduction: string,
    thumbnail: string,
    writer: User,
    category: Category,
  ) {
    super();
    this.title = title;
    this.content = content;
    this.introduction = introduction;
    this.thumbnail = thumbnail;
    this.writer = writer;
    this.category = category;
  }

  static create(
    title: string,
    content: string,
    introdution: string,
    thumbnail: string,
    writer: User,
    category: Category,
  ) {
    return new Post(title, content, introdution, thumbnail, writer, category);
  }
}
