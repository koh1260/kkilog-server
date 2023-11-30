import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { CustomTypeOrmModule } from 'src/config/typeorm/custom-typeorm-module';
import { UsersRepository } from 'src/modules/users/users.repository';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CustomTypeOrmModule.forCustomRepository([UsersRepository]),
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
  ],
  providers: [ConfigService, AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
