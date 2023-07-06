import { IsEmail } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
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

  static of(email: string, name: string, nickname: string, password: string) {
    const userEntity = new UserEntity();
    userEntity.email = email;
    userEntity.name = name;
    userEntity.nickname = nickname;
    userEntity.password = password;

    return userEntity;
  }
}
