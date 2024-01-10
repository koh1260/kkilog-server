import { PrismaClient } from '@prisma/client';
import { generateCategory } from './generate-category';
import { generateUser } from './generate-user';
import { generatePost } from './generate-post';

interface Comment {
  id: number;
  createAt: Date;
  updateAt: Date;
  content: string;
  parent: number | null;
  writerId: number;
  postId: number;
}

const prisma = new PrismaClient();

/**
 * @param commentNum 생성할 댓글 수.
 * @returns 생성된 댓글 리스트, 댓글이 작성된 게시글 번호
 */
export const generateComment = async (commentNum: number) => {
  await generateCategory();
  const user = await generateUser();
  const post = (await generatePost(1)).postList[0];
  const commentList: Comment[] = [];

  for (let i = 1; i <= commentNum; i++) {
    const comment = await prisma.comment.create({
      data: {
        content: `Test Content ${i}`,
        postId: post.id,
        writerId: user.id,
      },
    });
    commentList.push(comment);
  }

  await prisma.$disconnect();

  return { commentList, postId: post.id };
};
