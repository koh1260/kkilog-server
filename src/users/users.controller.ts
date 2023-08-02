import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { UserInfo } from '../auth/jwt.strategy';
import { LoginUser } from '../common/decorator/user.decorator';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  /**
   * 회원가입.
   * @param dto 회원 가입에 필요한 정보
   * @returns 가입된 회원 객체
   */
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(dto);
  }

  /**
   * 로그인.
   * @param user jwt strategy에서 입력한 로그인 회원 정보
   * @returns accessToken이 담긴 객체
   */
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Res() res: Response, @LoginUser() user: UserInfo) {
    const token = await this.authService.login(user);
    res.header('Authorization', 'Bearer ' + token.accessToken);
    return res.status(200).send('로그인 완료.');
  }
}
