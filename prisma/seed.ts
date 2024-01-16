import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  datasourceUrl: 'mysql://root:test@localhost:3307/kkilog',
});

async function main() {
  const category1 = await prisma.categorie.upsert({
    where: { categoryName: '🐌Front-end' },
    update: {},
    create: {
      id: 1,
      categoryName: '🐌Front-end',
    },
  });
  const category2 = await prisma.categorie.upsert({
    where: { categoryName: '🐢Back-end' },
    update: {},
    create: {
      id: 2,
      categoryName: '🐢Back-end',
    },
  });
  const category3 = await prisma.categorie.upsert({
    where: { categoryName: '🐑React' },
    update: {},
    create: {
      id: 3,
      categoryName: '🐑React',
      parentId: 1,
    },
  });
  const category4 = await prisma.categorie.upsert({
    where: { categoryName: '🐈‍⬛Nest' },
    update: {},
    create: {
      id: 4,
      categoryName: '🐈‍⬛Nest',
      parentId: 2,
    },
  });
  const category5 = await prisma.categorie.upsert({
    where: { categoryName: '🦭DB' },
    update: {},
    create: {
      categoryName: '🦭DB',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'koh1260@naver.com' },
    update: {},
    create: {
      email: 'koh1260@naver.com',
      nickname: '끼리',
      role: 'ADMIN',
      password: 'test',
      profileImage: '',
      posts: {
        create: {
          title: 'Hi Elephant',
          content: 'dumbo.world !!!!',
          introduction: 'Test Introduction',
          thumbnail:
            'https://plus.unsplash.com/premium_photo-1661741536462-2d7aedd6f672?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          categoryId: category1.id,
        },
      },
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'test@naver.com' },
    update: {},
    create: {
      id: 2,
      email: 'test@naver.com',
      nickname: '끼리리리',
      role: 'USER',
      password: 'test',
      profileImage: '',
      posts: {
        create: {
          title: 'Bye Elephant',
          content: 'dumbo.world !!!!',
          introduction: 'Test Introduction',
          thumbnail:
            'https://plus.unsplash.com/premium_photo-1661741536462-2d7aedd6f672?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          categoryId: category2.id,
        },
      },
    },
  });

  const post = await prisma.post.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      title: 'Bye Elephant',
      content: 'dumbo.world !!!!',
      introduction: 'Test Introduction',
      thumbnail:
        'https://plus.unsplash.com/premium_photo-1661741536462-2d7aedd6f672?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      writerId: 2,
      categoryId: category2.id,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      title: 'Byeeeeeee Elephant',
      content: 'dumbo.world !!!!',
      introduction: 'Test Introduction',
      thumbnail:
        'https://plus.unsplash.com/premium_photo-1661741536462-2d7aedd6f672?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      writerId: 2,
      categoryId: category5.id,
    },
  });

  console.log({
    category1,
    category2,
    category3,
    category4,
    category5,
    user,
    user2,
    post,
    post2,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
