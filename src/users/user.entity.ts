import 'reflect-metadata';
import { Column, Entity, OneToMany } from 'typeorm';
import { Post } from '../posts/entities/post.entity';
import { BaseModel } from '../common/base-enttity/base.entity';

@Entity('user')
export class User extends BaseModel {
  @Column({ length: 50, unique: true })
  email!: string;

  @Column({ length: 20, nullable: false })
  nickname!: string;

  @Column({ length: 5, nullable: false })
  role: 'USER' | 'ADMIN' = 'USER';

  @Column({ type: 'text', name: 'profile_image', default: true })
  profileImage?: string = 'test';

  @Column({ length: 255 })
  password!: string;

  @OneToMany(() => Post, (posts) => posts.writer)
  posts?: Post;

  static of(email: string, nickname: string, password: string) {
    const user = new User();
    user.email = email;
    user.nickname = nickname;
    user.password = password;

    return user;
  }
}
