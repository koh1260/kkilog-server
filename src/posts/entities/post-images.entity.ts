import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '../../common/base-enttity/base.entity';
import { Post } from './post.entity';

@Entity('post_image')
export class PostImage extends BaseModel {
  @Column({ type: 'text', name: 'image_url' })
  imageUrl: string;

  @ManyToOne(() => Post)
  post: Post;

  constructor(imageUrl: string, post: Post) {
    super();
    this.imageUrl = imageUrl;
    this.post = post;
  }
}
