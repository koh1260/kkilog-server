import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '@prisma/client';
import { generatePost } from './helper/generate-post';
import { CreatePostDto } from '../src/modules/posts/dto/create-post.dto';
import { generateCategory } from './helper/generate-category';
import { CreateUserDto } from '../src/modules/users/dto/create-user.dto';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { UpdatePostDto } from '../src/modules/posts/dto/update-post.dto';

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

  it('게시글_작성', async () => {
    await login('ADMIN');
    const categoryList = await generateCategory();
    const dto = CreatePostDto.create(
      'Test Title',
      'Test Content',
      'Test Intro',
      'test.image.png',
      categoryList[2].categoryName,
    );

    const response = await request(app.getHttpServer())
      .post('/posts')
      .set('Cookie', accessToken)
      .send(dto);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('게시글 작성 완료.');
  });

  it('일반_회원_게시글_작성_예외', async () => {
    await login('USER');
    const categoryList = await generateCategory();
    const dto = CreatePostDto.create(
      'Test Title',
      'Test Content',
      'Test Intro',
      'test.image.png',
      categoryList[2].categoryName,
    );

    const response = await request(app.getHttpServer())
      .post('/posts')
      .set('Cookie', accessToken)
      .send(dto);

    expect(response.status).toBe(401);
  });

  it('권한_없는_게시글_작성_예외', async () => {
    const unauthorizedToken = 'unauthorizedToken';

    const categoryList = await generateCategory();
    const dto = CreatePostDto.create(
      'Test Title',
      'Test Content',
      'Test Intro',
      'test.image.png',
      categoryList[2].categoryName,
    );

    const response = await request(app.getHttpServer())
      .post('/posts')
      .set('Cookie', unauthorizedToken)
      .send(dto);

    expect(response.status).toBe(401);
  });

  it('게시글_전체_조회', async () => {
    await generatePost(4);
    const response = await request(app.getHttpServer()).get('/posts');

    expect(response.status).toBe(200);
    expect(response.body.result.length).toBe(4);
  });

  it('게시글_상세_조회', async () => {
    const { postList } = await generatePost(1);
    const post = postList[0];

    const response = await request(app.getHttpServer()).get(
      `/posts/${post.id}`,
    );

    const writer = await prisma.user.findUnique({
      where: { id: post.writerId },
    });

    expect(response.status).toBe(200);
    expect(response.body.result.title).toBe(post.title);
    expect(response.body.result.content).toBe(post.content);
    expect(response.body.result.writer.nickname).toBe(writer?.nickname);
  });

  it('카테고리_이름별_조회', async () => {
    const { categoryName } = await generatePost(5);
    const response = await request(app.getHttpServer()).get(
      encodeURI(`/posts/category/?categoryName=${categoryName}`),
    );

    expect(response.status).toBe(200);
    expect(response.body.result.length).toBe(5);
  });

  it('이전_다음_게시글_조회', async () => {
    const { postList } = await generatePost(4);
    const response = await request(app.getHttpServer()).get(
      `/posts/other/${postList[2].id}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.result[0].id).toBe(postList[1].id);
    expect(response.body.result[1].id).toBe(postList[3].id);
  });

  it('게시글_업데이트', async () => {
    await login('ADMIN');

    const { postList } = await generatePost(1);
    const updateDto: UpdatePostDto = {
      title: 'Updated Title',
      content: 'Updated Content',
    };

    const response = await request(app.getHttpServer())
      .patch(`/posts/${postList[0].id}`)
      .set('Cookie', accessToken)
      .send(updateDto);

    const updatedPost = await prisma.post.findUnique({
      where: { id: postList[0].id },
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('게시글 수정 완료.');
    expect(updatedPost?.title).toBe(updateDto.title);
    expect(updatedPost?.content).toBe(updateDto.content);
  });

  it('일반_회원_게시글_업데이트_예외', async () => {
    await login('USER');

    const { postList } = await generatePost(1);
    const updateDto: UpdatePostDto = {
      title: 'Updated Title',
      content: 'Updated Content',
    };

    const response = await request(app.getHttpServer())
      .patch(`/posts/${postList[0].id}`)
      .set('Cookie', accessToken)
      .send(updateDto);

    expect(response.status).toBe(401);
  });

  it('권한_없는_게시글_업데이트_예외', async () => {
    const unauthorizedToken = 'unauthorizedToken';

    const { postList } = await generatePost(1);
    const updateDto: UpdatePostDto = {
      title: 'Updated Title',
      content: 'Updated Content',
    };

    const response = await request(app.getHttpServer())
      .patch(`/posts/${postList[0].id}`)
      .set('Cookie', unauthorizedToken)
      .send(updateDto);

    expect(response.status).toBe(401);
  });

  it('게시글_삭제', async () => {
    await login('ADMIN');
    const { postList } = await generatePost(1);

    const response = await request(app.getHttpServer())
      .delete(`/posts/${postList[0].id}`)
      .set('Cookie', accessToken);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('게시글 삭제 완료.');
  });

  it('일반_회원_게시글_삭제_예외', async () => {
    await login('USER');
    const { postList } = await generatePost(1);

    const response = await request(app.getHttpServer())
      .delete(`/posts/${postList[0].id}`)
      .set('Cookie', accessToken);

    expect(response.status).toBe(401);
  });

  it('권한_없는_게시글_삭제', async () => {
    const unauthorizedToken = 'unauthorizedToken';
    const { postList } = await generatePost(1);

    const response = await request(app.getHttpServer())
      .delete(`/posts/${postList[0].id}`)
      .set('Cookie', unauthorizedToken);

    expect(response.status).toBe(401);
  });

  it('게시글_좋아요', async () => {
    await login('USER');
    const { postList } = await generatePost(1);

    const response = await request(app.getHttpServer())
      .get(`/posts/like/${postList[0].id}`)
      .set('Cookie', accessToken);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('좋아요.');
  });

  it('권한_없는_게시글_좋아요_예외', async () => {
    const unauthorizedToken = 'unauthorizedToken';
    const { postList } = await generatePost(1);

    const response = await request(app.getHttpServer())
      .get(`/posts/like/${postList[0].id}`)
      .set('Cookie', unauthorizedToken);

    expect(response.status).toBe(401);
  });

  it('게시글_좋아요_여부_확인', async () => {
    await login('USER');
    const { postList } = await generatePost(1);

    await request(app.getHttpServer())
      .get(`/posts/like/${postList[0].id}`)
      .set('Cookie', accessToken);

    const response = await request(app.getHttpServer())
      .get(`/posts/like-check/${postList[0].id}`)
      .set('Cookie', accessToken);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('좋아요 여부 확인.');
    expect(response.body.result.liked).toBe(true);
  });

  it('게시글_좋아요_수_조회', async () => {
    await login('USER');
    const { postList } = await generatePost(1);

    await request(app.getHttpServer())
      .get(`/posts/like/${postList[0].id}`)
      .set('Cookie', accessToken);

    const response = await request(app.getHttpServer())
      .get(`/posts/like-count/?post=${postList[0].id}`)
      .set('Cookie', accessToken);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('좋아요 개수.');
    expect(response.body.result.likeCount).toBe(1);
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
