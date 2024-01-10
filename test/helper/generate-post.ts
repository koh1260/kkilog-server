import { PrismaClient } from '@prisma/client';
import { generateCategory } from './generate-category';
import { generateUser } from './generate-user';

interface Post {
  id: number;
  createAt: Date;
  updateAt: Date;
  title: string;
  content: string;
  publicScope: string;
  introduction: string;
  thumbnail: string;
  likes: number;
  writerId: number;
  categoryId: number | null;
}

const prisma = new PrismaClient();

/**
 * @param postNum 생성할 게시글 수.
 * @returns 생성된 게시글 리스트, 게시글이 작성된 카테고리
 */
export const generatePost = async (postNum: number) => {
  const categoryList = await generateCategory();
  const user = await generateUser();
  const postList: Post[] = [];

  for (let i = 1; i <= postNum; i++) {
    const post = await prisma.post.create({
      data: {
        title: `Test title ${i}`,
        content: `Test Content ${i}`,
        introduction: `Test Introduction ${i}`,
        thumbnail: `test.image${i}.png`,
        categoryId: categoryList[0].id,
        writerId: user.id,
      },
    });
    postList.push(post);
  }

  return { postList, categoryName: categoryList[0].categoryName };
};
