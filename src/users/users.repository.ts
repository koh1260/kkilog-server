import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CustomRepository } from '../common/custom-repository/custom-repository';

@CustomRepository(User)
export class UsersRepository extends Repository<User> {
  async findOneByEmail(email: string) {
    return await this.findOne({
      select: ['id', 'email', 'nickname', 'profileImage', 'role'],
      where: { email: email },
    });
  }

  async findOneById(id: number) {
    return await this.findOne({
      select: ['id', 'email', 'nickname', 'profileImage', 'role'],
      where: { id: id },
    });
  }
}
