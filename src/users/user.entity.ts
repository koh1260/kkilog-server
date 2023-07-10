import { IsEmail } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../posts/entities/post.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  nickname: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @OneToMany(() => Post, (posts) => posts.user)
  posts: Post;

  static create(
    email: string,
    name: string,
    nickname: string,
    password: string,
  ) {
    const userEntity = new User();
    userEntity.email = email;
    userEntity.name = name;
    userEntity.nickname = nickname;
    userEntity.password = password;

    return userEntity;
  }
}
