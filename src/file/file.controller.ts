import {
  Controller,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CustomResponse } from '../common/response/custom-reponse';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000 * 1000 * 5 })],
      }),
    )
    file: Express.MulterS3.File,
  ) {
    console.log('파일: ' + file);
    const image = this.fileService.uploadFile(file);
    return CustomResponse.create(HttpStatus.OK, '이미지 업로드 완료', image);
  }
}
