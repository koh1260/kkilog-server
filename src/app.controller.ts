import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  @ApiOperation({ summary: '테스트용 hello kkilog', description: '테스트용' })
  helloKkilog() {
    return '🐘KKilog!!🐘';
  }
}
