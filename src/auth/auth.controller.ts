import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

interface CutomRequest extends Request {
  cookie: {
    refresh_token: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
