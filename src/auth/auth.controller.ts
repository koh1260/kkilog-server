import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { string } from 'joi';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ResponseEntity } from '../common/response/response';
import { LoginUser } from '../common/decorators/user.decorator';
import { UserInfo } from './jwt.strategy';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Access Token 재발급',
    description: 'Refresh Token으로 Access Token을 재발급한다.',
  })
  @ApiCreatedResponse({
    description: 'Refresh Token으로 Access Token을 재발급한다.',
    type: string,
  })
  @Get('/refresh')
  async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    const decodedToken = await this.authService.verifyRefreshToken(
      req.cookies['refresh_token'],
    );
    const accessToken = await this.authService.regenerateAccessToken(
      decodedToken.id,
    );
    res.cookie('access_token', accessToken, { httpOnly: true });

    return res
      .status(200)
      .json(ResponseEntity.create(HttpStatus.OK, 'Access Token 재발급 성공'));
  }

  @ApiOperation({
    summary: '로그인 검증',
    description: 'Access Token과 email을 통해 로그인을 검증한다.',
  })
  @ApiCreatedResponse({
    description: 'Access Token과 email을 통해 로그인을 검증한다.',
    type: string,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/login-validate')
  async loginValidate(@LoginUser() user: UserInfo) {
    const loginedUser = await this.authService.validateEmail(user.email);
    return ResponseEntity.create(HttpStatus.OK, '인증 성공', loginedUser);
  }
}
