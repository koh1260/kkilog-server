import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from '../../common/base-enttity/base.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity('categories')
export class Category extends BaseModel {
  @Column({ type: 'char', length: 15, unique: true })
  name: string;

  @ManyToOne(() => Category, (category) => category.childCategories)
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  childCategories: Category[];

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
