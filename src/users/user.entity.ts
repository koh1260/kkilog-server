import 'reflect-metadata';
import { Column, Entity, OneToMany } from 'typeorm';
import { Post } from '../posts/entities/post.entity';
import { BaseModel } from '../common/base-enttity/base.entity';

@Entity('user')
export class User extends BaseModel {
  @Column({ length: 50, unique: true })
  email: string;

  @Column({ length: 20, nullable: false })
  nickname: string;

  @Column({ type: 'char', length: 5, nullable: false })
  role: 'USER' | 'ADMIN' = 'USER';

  @Column({ type: 'text', name: 'profile_image', default: true })
  profileImage?: string = 'test';

  @Column({ length: 255 })
  password: string;

  @OneToMany(() => Post, (posts) => posts.writer)
  posts?: Post;

  constructor(
    email: string,
    nickname: string,
    password: string,
    profileImage?: string,
  ) {
    super();
    this.email = email;
    this.nickname = nickname;
    this.password = password;
    this.profileImage = profileImage;
  }

  static create(
    email: string,
    nickname: string,
    password: string,
    profileImage?: string,
  ) {
    return new User(email, nickname, password, profileImage);
  }
}
