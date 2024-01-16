import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  datasourceUrl: 'mysql://root:test@localhost:3307/kkilog',
});
