import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from '../../auth/auth.service';
import { LocalAuthGuard } from '../../auth/local-auth.guard';
import { UserInfo } from '../../auth/jwt.strategy';
import { LoginUser } from '../../common/decorators/user.decorator';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseEntity } from '../../common/response/response';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

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
  async createUser(@Body() dto: CreateUserDto) {
    await this.usersService.createUser(dto);
    return ResponseEntity.create(HttpStatus.CREATED, '회원가입 완료.');
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({ summary: '로그인 API', description: '로그인을 한다.' })
  @ApiCreatedResponse({ description: '로그인을 한다' })
  async login(@Res() res: Response, @LoginUser() user: UserInfo) {
    const userInfo = await this.usersService.getProfile(user.id);
    const tokens = await this.authService.login(user);
    res.header('Authorization', 'Bearer ' + tokens.accessToken);
    res.cookie('access_token', tokens.accessToken, { httpOnly: true });
    res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });

    return res
      .status(200)
      .json(ResponseEntity.create(HttpStatus.OK, '로그인 완료.', userInfo));
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  @ApiOperation({
    summary: '로그아웃 API',
    description: 'http only cookie를 clear해 로그아웃을 한다.',
  })
  @ApiCreatedResponse({ description: '로그아웃을 한다' })
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return res
      .status(200)
      .json(ResponseEntity.create(HttpStatus.OK, '로그아웃 완료.'));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '회원 정보 조회 API',
    description: 'Access Token을 해석해 회원 정보를 조회한다.',
  })
  @ApiCreatedResponse({
    description: 'Access Token을 해석해 회원 정보를 조회한다.',
    type: User,
  })
  @ApiBearerAuth()
  async getProfile(@LoginUser() user: UserInfo) {
    const profile = await this.usersService.getProfile(user.id);
    return ResponseEntity.create(HttpStatus.OK, '회원 정보 조회', profile);
  }
}
