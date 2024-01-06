import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from '../../../config/typeorm/base.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity('categorie')
export class Category extends BaseModel {
  @Column({
    length: 20,
    unique: true,
    name: 'category_name',
    nullable: false,
  })
  categoryName!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  icon!: string;

  @ManyToOne(() => Category, (category) => category.childCategories, {
    nullable: true,
  })
  @JoinColumn({
    name: 'parent_id',
  })
  parentCategory?: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  childCategories?: Category[];

  @OneToMany(() => Post, (post) => post.category)
  posts?: Post[];

  static of(categoryName: string) {
    const category = new Category();
    category.categoryName = categoryName;

    return category;
  }
}
