import { prisma } from './prisma';

/**
 * @returns ADMIN 권한을 가진 회원.
 */
export const generateUser = async (role?: 'USER') => {
  const user = await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: {},
    create: {
      email: 'test@test.com',
      nickname: 'test-nickname',
      password: 'testpassword',
      profileImage: 'Test Image',
      role: role ? role : 'ADMIN',
    },
  });

  await prisma.$disconnect();

  return user;
};
