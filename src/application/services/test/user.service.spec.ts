import { UserService } from '@domain/services/user.service';
import { UserRepository } from '@infrastructure/database/user.repository';
import { Test, TestingModule } from '@nestjs/testing';

describe('UserAppService', () => {
  let userService: UserService;
  let userRepositoryMock: Partial<UserRepository>;

  beforeEach(async () => {
    userRepositoryMock = {
      create: jest.fn().mockResolvedValue({ id: 1, username: 'test_user' }),
      findByUsername: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: UserRepository, useValue: userRepositoryMock }],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should create a user successfully', async () => {
    const username = 'test_user';

    const result = await userService.createUser({ username });

    expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith({ username });
    expect(userRepositoryMock.create).toHaveBeenCalledWith({ username });
    expect(result).toEqual({ id: 1, username: 'test_user' });
  });

  it('should throw an error if the username already exists', async () => {
    const username = 'existing_user';

    userRepositoryMock.findByUsername = jest.fn().mockResolvedValue({ id: 2, username });

    await expect(userService.createUser({ username })).rejects.toThrow(`Username "${username}" already exists`);

    expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith({ username });
    expect(userRepositoryMock.create).not.toHaveBeenCalled();
  });
});
