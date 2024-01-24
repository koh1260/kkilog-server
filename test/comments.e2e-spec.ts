import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';

import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/modules/users/dto/request/create-user.dto';
import { json, urlencoded } from 'express';
import { generatePost } from './helper/generate-post';
import { CreateCommentDto } from '../src/modules/comments/dto/request/create-comment.dto';
import { generateComment } from './helper/generate-comment';
import { UserInfo } from '../src/auth/jwt.strategy';
import { UpdateCommentDto } from '../src/modules/comments/dto/request/update-comment.dto';
import { generateUser } from './helper/generate-user';

describe('Comments (e2e)', () => {
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
    await prisma.comment.deleteMany({});
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

  it('댓글_작성', async () => {
    const { id } = await login('USER');
    const { postList } = await generatePost(3);
    const post = postList[1];

    const createDto = CreateCommentDto.create('Test Content!', post.id, id);

    const response = await request(app.getHttpServer())
      .post('/comments')
      .set('Cookie', accessToken)
      .send(createDto);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('댓글 작성 완료.');
  });

  it('특정_게시글_댓글_전체_조회', async () => {
    const { postId } = await generateComment(4);

    const response = await request(app.getHttpServer()).get(
      `/comments/?post=${postId}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('댓글 전체 조회.');
    expect(response.body.result.length).toBe(4);
  });

  it('특정_댓글의_자식_댓글_조회', async () => {
    const { id } = await login('USER');
    const { commentList, postId } = await generateComment(1);
    const parentId = commentList[0].id;

    await prisma.comment.createMany({
      data: [
        {
          postId,
          writerId: id,
          parent: parentId,
          content: 'Test Content 1',
        },
        {
          postId,
          writerId: id,
          parent: parentId,
          content: 'Test Content 2',
        },
        {
          postId,
          writerId: id,
          parent: parentId,
          content: 'Test Content 3',
        },
      ],
    });

    const response = await request(app.getHttpServer()).get(
      `/comments/child/?parent=${parentId}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('자식 댓글 조회');
    expect(response.body.result.length).toBe(3);
  });

  it('댓글_수정', async () => {
    const { id } = await login('USER');
    const postId = (await generatePost(1)).postList[0].id;
    const comment = await prisma.comment.create({
      data: {
        postId,
        writerId: id,
        content: 'Test Content',
      },
    });
    const updateDto = UpdateCommentDto.create('Updated Content');

    const response = await request(app.getHttpServer())
      .patch(`/comments/${comment.id}`)
      .set('Cookie', accessToken)
      .send(updateDto);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('댓글 수정 완료.');
  });

  it('작성자가_아닌_댓글_수정_예외', async () => {
    await login('USER');
    const commentWriter = (await generateUser('USER')).id;
    const postId = (await generatePost(1)).postList[0].id;
    const comment = await prisma.comment.create({
      data: {
        postId,
        writerId: commentWriter,
        content: 'Test Content',
      },
    });
    const updateDto = UpdateCommentDto.create('Updated Content');

    const response = await request(app.getHttpServer())
      .patch(`/comments/${comment.id}`)
      .set('Cookie', accessToken)
      .send(updateDto);

    expect(response.status).toBe(401);
  });

  it('댓글_삭제', async () => {
    const { id } = await login('USER');
    const postId = (await generatePost(1)).postList[0].id;
    const comment = await prisma.comment.create({
      data: {
        postId,
        writerId: id,
        content: 'Test Content',
      },
    });

    const response = await request(app.getHttpServer())
      .delete(`/comments/${comment.id}`)
      .set('Cookie', accessToken);

    const deletedComment = await prisma.comment.findUnique({
      where: { id: comment.id },
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('댓글 삭제 완료.');
    expect(deletedComment).toBeNull();
  });

  it('작성자가_아닌_댓글_삭제_예외', async () => {
    await login('USER');
    const commentWriter = (await generateUser('USER')).id;
    const postId = (await generatePost(1)).postList[0].id;
    const comment = await prisma.comment.create({
      data: {
        postId,
        writerId: commentWriter,
        content: 'Test Content',
      },
    });

    const response = await request(app.getHttpServer())
      .delete(`/comments/${comment.id}`)
      .set('Cookie', accessToken);

    expect(response.status).toBe(401);
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
    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send(credential);

    accessToken = response.headers['set-cookie'][0].split(';')[0];
    const userInfo = response.body.result as UserInfo;

    return userInfo;
  };
});
