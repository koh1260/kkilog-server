import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import { comparePassword } from '../utils/password';
import { UserInfo } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOneByEmail(email);

    if (user && (await comparePassword(password, user.password))) {
      const { email, nickname }: UserInfo = user;
      return {
        email: email,
        name: name,
        nickname: nickname,
      };
    }
    return null;
  }

  async login(user: UserInfo) {
    const payload = {
      email: user.email,
      nickname: user.nickname,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
