import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from '../../common/base-enttity/base.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity('categorie')
export class Category extends BaseModel {
  @Column({
    length: 15,
    unique: true,
    name: 'category_name',
    nullable: false,
  })
  categoryName!: string;

  @ManyToOne(() => Category, (category) => category.childCategories)
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
