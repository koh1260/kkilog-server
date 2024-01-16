import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersRepository } from '../modules/users/users.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: configService.get<number>('JWT_ACCESS_EXPIRATION_TIME'),
          },
        };
      },
    }),
    PrismaModule,
  ],
  providers: [
    ConfigService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UsersRepository,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
