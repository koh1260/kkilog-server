import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TestTypeOrmModule } from '../common/test-database/test-db.module';
import { CustomTypeOrmModule } from '../common/custom-repository/custom-typeorm-module';
import { UsersRepository } from '../users/users.repository';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TestTypeOrmModule,
        CustomTypeOrmModule.forCustomRepository([UsersRepository]),
      ],
      providers: [AuthService, ConfigService, JwtService],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
