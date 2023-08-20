import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { string } from 'joi';
import { JwtAuthGuard } from './jwt-auth.guard';

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
  async refreshAccessToken(@Req() req: Request) {
    const decodedToken = await this.authService.verifyRefreshToken(
      req.cookies['refresh_token'],
    );

    return {
      accessToken: await this.authService.regenerateAccessToken(
        decodedToken.id,
      ),
    };
  }

  @ApiOperation({
    summary: '로그인 검증',
    description: 'Acess Token과 email을 통해 로그인을 검증한다.',
  })
  @ApiCreatedResponse({
    description: 'Acess Token과 email을 통해 로그인을 검증한다.',
    type: string,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/login-validate')
  async loginValidate(@Query('email') email: string) {
    console.log(email);
    await this.authService.validateEmail(email);
    return '굿';
  }
}
