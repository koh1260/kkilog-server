import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';

import { AppModule } from '../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.use(
      json({
        limit: '10mb',
      }),
    );
    app.use(
      urlencoded({
        limit: '10mb',
        extended: false,
      }),
    );
    app.enableCors({
      origin: process.env.CORS_ORIGIN,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    await app.init();
  });

  it('헬스_체크', async () => {
    const response = await request(app.getHttpServer()).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('🐘KKilog!!🐘');
  });
});
