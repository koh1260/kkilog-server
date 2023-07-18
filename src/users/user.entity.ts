import { IsEmail } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { Post } from '../posts/entities/post.entity';
import { BaseModel } from '../common/base-enttity/base.entity';

@Entity('users')
export class User extends BaseModel {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  nickname: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Post, (posts) => posts.user)
  posts?: Post;

  constructor(email: string, name: string, nickname: string, password: string) {
    super();
    this.email = email;
    this.name = name;
    this.nickname = nickname;
    this.password = password;
  }

  static create(
    email: string,
    name: string,
    nickname: string,
    password: string,
  ) {
    return new User(email, name, nickname, password);
  }
}
