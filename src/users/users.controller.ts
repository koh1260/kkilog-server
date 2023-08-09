import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
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

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Res() res: Response, @LoginUser() user: UserInfo) {
    const token = await this.authService.login(user);
    res.header('Authorization', 'Bearer ' + token.accessToken);
    return res.status(200).send('로그인 완료.');
  }

  @Get()
  async getProfile(@LoginUser() user: UserInfo) {
    return await this.usersService.getProfile(user.id);
  }
}
