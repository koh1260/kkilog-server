import { User } from '@prisma/client';

export type CreateUserData = Pick<User, 'email' | 'nickname' | 'password'>;

export interface Profile
  extends Pick<User, 'id' | 'email' | 'nickname' | 'role' | 'createAt'> {
  profileImage: string | null;
}
