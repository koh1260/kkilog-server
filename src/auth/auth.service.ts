import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';

interface UserInfo {
  email: string;
  name: string;
  nickname: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserInfo> {
    const user = await this.usersRepository.findOneBy({
      email: email,
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { email, name, nickname } = user;
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
      name: user.name,
      nickname: user.nickname,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
