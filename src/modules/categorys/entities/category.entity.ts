import { Categorie } from '@prisma/client';

export type PickCategory = Pick<Categorie, 'id' | 'categoryName'>;

export interface Category extends PickCategory {
  childrenCategories: PickCategory[];
}
