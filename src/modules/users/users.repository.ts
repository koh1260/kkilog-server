import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CustomRepository } from '../../config/typeorm/custom-repository';

@CustomRepository(User)
export class UsersRepository extends Repository<User> {
  async findOneById(id: number) {
    return await this.findOne({
      where: { id },
    });
  }

  async findOneByEmail(email: string) {
    return await this.findOne({
      where: { email },
    });
  }

  async findOneByNickname(nickname: string) {
    return await this.findOne({
      where: { nickname },
    });
  }
}
