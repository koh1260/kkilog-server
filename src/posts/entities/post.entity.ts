import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { PublicScope } from '../enumerate/public-scope';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  title: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({
    type: 'enum',
    enum: PublicScope.values(),
    default: PublicScope.PUBLIC.visible,
  })
  publicScope: PublicScope;

  @Column()
  introdution: string;

  @Column()
  thumbnail: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  static create(
    title: string,
    content: string,
    introdution: string,
    thumbnail: string,
    user: User,
    publicScope?: PublicScope,
  ) {
    const post = new Post();
    post.title = title;
    post.content = content;
    post.introdution = introdution;
    post.publicScope = publicScope;
    post.thumbnail = thumbnail;
    post.user = user;

    return post;
  }
}
