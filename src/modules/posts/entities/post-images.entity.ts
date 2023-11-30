import 'reflect-metadata';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from '../../../config/typeorm/base.entity';
import { Post } from './post.entity';

@Entity('post_image')
export class PostImage extends BaseModel {
  @Column({ type: 'text', name: 'image_url', nullable: false })
  imageUrl: string;

  @ManyToOne(() => Post, { nullable: false })
  @JoinColumn({
    name: 'post_id',
  })
  post: Post;

  constructor(imageUrl: string, post: Post) {
    super();
    this.imageUrl = imageUrl;
    this.post = post;
  }
}
