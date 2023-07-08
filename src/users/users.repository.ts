import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CustomRepository } from '../common/custom-repository';

@CustomRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {}
