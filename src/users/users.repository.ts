import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CustomRepository } from '../common/custom-repository/custom-repository';

@CustomRepository(User)
export class UsersRepository extends Repository<User> {
  async findOneByEmail(email: string) {
    return await this.findOneBy({
      email: email,
    });
  }
}
