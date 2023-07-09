import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 30 })
  title: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ type: 'char', length: 7 })
  publicScope: string;
}
