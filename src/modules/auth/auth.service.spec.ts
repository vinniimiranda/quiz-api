import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mockedConfigService from 'src/shared/utils/mocks/config.service';
import mockedJwtService from 'src/shared/utils/mocks/jwt.service';
import {
  User,
  UserSchema,
} from 'src/shared/infra/database/schemas/user.schema';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get('MONGO_URL'),
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
          }),
          inject: [ConfigService],
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        User,
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });
  afterAll(async () => {
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create an user', async () => {
    const user = await service.create({
      email: 'tester@gmail.com',
      name: 'tester',
      password: '123456',
    });
    expect(user).toHaveProperty('_id');
  });
  it('should authenticate an user', async () => {
    const { user, token } = await service.login({
      email: 'tester@gmail.com',
      password: '123456',
    });
    expect(user).toHaveProperty('_id');
    expect(token).toHaveProperty('accessToken');
    expect(token.accessToken).toBe('token');
  });
  it('should return null for invalid user credentials', async () => {
    const invalid = await service.login({
      email: 'tester@gmail.com',
      password: 'abc123',
    });
    expect(invalid).toBeNull();
  });
});
