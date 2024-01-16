import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from '../src/modules/users/dto/request/create-user.dto';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaClient],
    }).compile();

    prisma = moduleFixture.get<PrismaClient>(PrismaClient);
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

  afterEach(async () => {
    await prisma.postLike.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.categorie.deleteMany({
      where: {
        parentId: {
          not: null,
        },
      },
    });
    await prisma.categorie.deleteMany({});
    await prisma.$disconnect();
  });

  it('회원가입', async () => {
    const registerDto = CreateUserDto.create(
      'teste@test.com',
      'nickname',
      'qwer1234',
    );

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(registerDto);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('회원가입 완료.');
  });

  it('이메일_닉네임_중복_회원가입_예외', async () => {
    const registerDto = CreateUserDto.create(
      'teste@test.com',
      'nickname',
      'qwer1234',
    );

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(registerDto);
    const duplicateEmail = await request(app.getHttpServer())
      .post('/users')
      .send(registerDto);
    const duplicateNickname = await request(app.getHttpServer())
      .post('/users')
      .send({
        ...registerDto,
        email: 'teste2@test.com',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('회원가입 완료.');
    expect(duplicateEmail.status).toBe(409);
    expect(duplicateEmail.body.message).toBe('이미 존재하는 이메일입니다.');
    expect(duplicateNickname.status).toBe(409);
    expect(duplicateNickname.body.message).toBe('이미 존재하는 닉네임입니다.');
  });

  it('회원_정보_조회', async () => {
    await login('USER');

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Cookie', accessToken);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('회원 정보 조회');
  });

  it('로그인', async () => {
    const { email, password } = await register('USER');
    const credential = {
      username: email,
      password: password,
    };
    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send(credential);

    const loginedUser = await prisma.user.findUnique({
      where: { email },
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('로그인 완료.');
    expect(response.body.result.email).toBe(email);
    expect(response.body.result.nickname).toBe(loginedUser?.nickname);
  });

  it('존재하지_않는_이메일로_로그인_예외', async () => {
    await register('USER');
    const nonExistEmail = 'none@test.com';
    const credential = {
      username: nonExistEmail,
      password: 'password',
    };
    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send(credential);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('존재하지 않는 회원입니다.');
  });

  it('잘못된_비밀번호로_로그인_예외', async () => {
    const { email } = await register('USER');
    const invalidPassword = 'invalidpwd';
    const credential = {
      username: email,
      password: invalidPassword,
    };
    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send(credential);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('비밀번호가 일치하지 않습니다.');
  });

  it('로그아웃', async () => {
    await login('USER');

    const response = await request(app.getHttpServer())
      .get('/users/logout')
      .set('Cookie', accessToken);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('로그아웃 완료.');
  });

  afterAll(async () => {
    await app.close();
  });

  const register = async (role: 'ADMIN' | 'USER') => {
    const registerDto = CreateUserDto.create(
      'teste@test.com',
      'nickname',
      'qwer1234',
    );
    await request(app.getHttpServer()).post('/users').send(registerDto);

    if (role === 'ADMIN') {
      await prisma.user.update({
        where: {
          email: registerDto.email,
        },
        data: { role: 'ADMIN' },
      });
    }

    return {
      email: registerDto.email,
      password: registerDto.password,
    };
  };

  const login = async (role: 'USER' | 'ADMIN') => {
    const { email, password } = await register(role);
    const credential = {
      username: email,
      password: password,
    };
    await request(app.getHttpServer())
      .post('/users/login')
      .send(credential)
      .then((res) => {
        accessToken = res.headers['set-cookie'][0].split(';')[0];
      });
  };
});
