import { prisma } from './prisma';

/**
 * @returns 4개의 카테고리 생성.
 */
export const generateCategory = async () => {
  const forntEnd = await prisma.categorie.upsert({
    where: { categoryName: '🐌Front-end' },
    update: {},
    create: {
      id: 1,
      categoryName: '🐌Front-end',
    },
  });
  const backEnd = await prisma.categorie.upsert({
    where: { categoryName: '🐢Back-end' },
    update: {},
    create: {
      id: 2,
      categoryName: '🐢Back-end',
    },
  });
  const react = await prisma.categorie.upsert({
    where: { categoryName: '🐑React' },
    update: {},
    create: {
      id: 3,
      categoryName: '🐑React',
      parentId: 1,
    },
  });
  const nest = await prisma.categorie.upsert({
    where: { categoryName: '🐈‍⬛Nest' },
    update: {},
    create: {
      id: 4,
      categoryName: '🐈‍⬛Nest',
      parentId: 2,
    },
  });
  const categoryDb = await prisma.categorie.upsert({
    where: { categoryName: '🦭DB' },
    update: {},
    create: {
      categoryName: '🦭DB',
    },
  });

  await prisma.$disconnect();

  return [forntEnd, backEnd, react, nest, categoryDb];
};
