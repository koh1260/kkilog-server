import {
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomResponse } from '../common/response/custom-reponse';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.MulterS3.File) {
    const image = this.fileService.uploadFile(file);
    return CustomResponse.create(HttpStatus.OK, '이미지 업로드 완료', image);
  }
}
