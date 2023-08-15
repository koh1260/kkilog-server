import 'reflect-metadata';
import { Column, Entity, OneToMany } from 'typeorm';
import { Post } from '../posts/entities/post.entity';
import { BaseModel } from '../common/base-enttity/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class User extends BaseModel {
  @Column({ length: 50, unique: true })
  @ApiProperty({ description: '이메일' })
  email!: string;

  @Column({ length: 20, nullable: false })
  @ApiProperty({ description: '닉네임' })
  nickname!: string;

  @Column({ length: 5, nullable: false })
  @ApiProperty({ description: '권한' })
  role: 'USER' | 'ADMIN' = 'USER';

  @Column({ type: 'text', name: 'profile_image', default: true })
  @ApiProperty({ description: '프로필 사진' })
  profileImage?: string = 'test';

  @Column({ length: 255 })
  @ApiProperty({ description: '비밀번호' })
  password!: string;

  @Column({ type: 'text', name: 'refresh_token', nullable: true })
  refreshToken?: string;

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
