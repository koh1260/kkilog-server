import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { CustomTypeOrmModule } from 'src/common/custom-repository/custom-typeorm-module';
import { UsersRepository } from 'src/users/users.repository';
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
          secret: configService.get('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: configService.get<number>('JWT_ACCESS_EXPIRATION_TIME'),
          },
        };
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, ConfigService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
