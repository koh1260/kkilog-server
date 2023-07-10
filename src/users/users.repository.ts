import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CustomRepository } from '../common/custom-repository';

@CustomRepository(User)
export class UsersRepository extends Repository<User> {}
