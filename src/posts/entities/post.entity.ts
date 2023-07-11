import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/user.entity';
import { PublicScope } from '../enumerate/public-scope';
import { BaseModel } from '../../common/base-enttity/base.entity';
import { Category } from '../../categorys/entities/category.entity';

@Entity('posts')
export class Post extends BaseModel {
  @Column({ length: 30 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: PublicScope.values(),
    default: PublicScope.PUBLIC.visible,
  })
  publicScope: PublicScope;

  @Column()
  introduction: string;

  @Column({ type: 'text' })
  thumbnail: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToOne(() => Category, (category) => category.posts)
  category: Category;

  static create(
    title: string,
    content: string,
    introdution: string,
    thumbnail: string,
    user: User,
    category: Category,
    publicScope?: PublicScope,
  ) {
    const post = new Post();
    post.title = title;
    post.content = content;
    post.introduction = introdution;
    post.publicScope = publicScope;
    post.thumbnail = thumbnail;
    post.user = user;
    post.category = category;

    return post;
  }
}
