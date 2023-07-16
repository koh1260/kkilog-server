import {
  Body,
  Controller,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { HttpExceptionFilter } from '../exception/http-exception.filter';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';

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
  async login(@Request() req: any) {
    return await this.authService.login(req.user);
  }
}
