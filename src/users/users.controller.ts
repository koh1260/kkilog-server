import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { UserInfo } from '../auth/jwt.strategy';
import { LoginUser } from '../common/decorator/user.decorator';
import { Response } from 'express';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('회원 API')
export class UsersController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post()
  @ApiOperation({ summary: '회원가입 API', description: '회원을 생성한다.' })
  @ApiCreatedResponse({ description: '회원을 생성한다', type: User })
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({ summary: '로그인 API', description: '로그인을 한다.' })
  @ApiCreatedResponse({ description: '로그인을 한다' })
  async login(@Res() res: Response, @LoginUser() user: UserInfo) {
    const tokens = await this.authService.login(user);
    res.header('Authorization', 'Bearer ' + tokens.accessToken);
    res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
    return res.status(200).send('로그인 완료.');
  }

  @Get()
  @ApiOperation({
    summary: '회원 정보 조회 API',
    description: 'Access Token을 해석해 회원 정보를 조회한다.',
  })
  @ApiCreatedResponse({
    description: 'Access Token을 해석해 회원 정보를 조회한다.',
    type: User,
  })
  async getProfile(@LoginUser() user: UserInfo) {
    return await this.usersService.getProfile(user.id);
  }
}
