import { UserAppService } from '@app/services/user.service';
import { UserService } from '@domain/services/user.service';
import { UserRepository } from '@infrastructure/database/user.repository';
import { PrismaService } from '@libs/prisma';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { prepareMockDatabase, truncateMockData } from './utils';

describe('UserController Integration', () => {
  let userController: UserController;
  let prismaServiceMock: PrismaService;

  beforeAll(async () => {
    prismaServiceMock = await prepareMockDatabase();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: PrismaService, useValue: prismaServiceMock }, UserService, UserAppService, UserRepository],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  afterAll(async () => {
    await truncateMockData(prismaServiceMock);
    await prismaServiceMock.$disconnect();
  });

  it('should create a user', async () => {
    const params = { username: 'user' };

    const result = await userController.create(params);

    expect(result.id).toBe(1);
    expect(result.username).toBe('user');
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });
});
