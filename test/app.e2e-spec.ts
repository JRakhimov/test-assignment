import { prepareMockDatabase } from '@infrastructure/controllers/test/utils';
import { AppModule } from '@infrastructure/modules/app.module';
import { PrismaService } from '@libs/prisma';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaServiceMock: PrismaService;

  beforeAll(async () => {
    prismaServiceMock = await prepareMockDatabase();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        forbidUnknownValues: true,
        enableDebugMessages: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await prismaServiceMock.$disconnect();
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/').expect(200);

    expect(response.body).toEqual({ status: true });
  });

  describe('/users (POST)', () => {
    it('should successfully create user', async () => {
      const response = await request(app.getHttpServer()).post('/users').send({ username: 'john' }).expect(201);

      expect(response.body.id).toBe(1);
      expect(response.body.username).toBe('john');
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('should throw error for empty body', async () => {
      const response = await request(app.getHttpServer()).post('/users').expect(400);

      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toHaveLength(2);
    });
  });
});
