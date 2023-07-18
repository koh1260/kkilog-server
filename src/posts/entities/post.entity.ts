import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/user.entity';
import { PublicScope } from '../enumerate/public-scope';
import { BaseModel } from '../../common/base-enttity/base.entity';
import { Category } from '../../categorys/entities/category.entity';
import { Comment } from '../../comments/entities/comment.entity';

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
  publicScope?: PublicScope;

  @Column()
  introduction: string;

  @Column({ type: 'text' })
  thumbnail: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToOne(() => Category, (category) => category.posts)
  category: Category;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments?: Comment[];

  constructor(
    title: string,
    content: string,
    introduction: string,
    thumbnail: string,
    user: User,
    category: Category,
  ) {
    super();
    this.title = title;
    this.content = content;
    this.introduction = introduction;
    this.thumbnail = thumbnail;
    this.user = user;
    this.category = category;
  }

  static create(
    title: string,
    content: string,
    introdution: string,
    thumbnail: string,
    user: User,
    category: Category,
  ) {
    return new Post(title, content, introdution, thumbnail, user, category);
  }
}
