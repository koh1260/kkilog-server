import { ApiProperty } from '@nestjs/swagger';
import 'reflect-metadata';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '번호' })
  id!: number;

  @CreateDateColumn({ name: 'create_at' })
  @ApiProperty({ description: '생성 날짜' })
  createAt!: Date;

  @UpdateDateColumn({ name: 'update_at' })
  @ApiProperty({ description: '마지막 업데이트 날짜' })
  updateAt!: Date;
}
