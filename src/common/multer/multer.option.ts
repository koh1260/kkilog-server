import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multerS3 from 'multer-s3';
import * as path from 'path';

export const multerOptionsFactory = (
  configService: ConfigService,
): MulterOptions => {
  // s3 인스턴스를 생성합니다.
  const s3 = new S3Client({
    region: configService.get('AWS_BUCKET_REGION')!,
    credentials: {
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID')!,
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY')!,
    },
  });

  return {
    storage: multerS3({
      s3,
      bucket: configService.get('AWS_BUCKET_NAME')!,
      acl: 'public-read',
      key(_req, file, done) {
        try {
          console.log(file);
          const folder = 'kkilog';
          const ext = path.extname(file.originalname);
          const basename = path.basename(file.originalname, ext);
          done(null, `${folder}/${basename}_${Date.now()}${ext}`);
        } catch (e) {}
      },
    }),
    limits: { fileSize: 3 * 1024 * 1024 },
  };
};
