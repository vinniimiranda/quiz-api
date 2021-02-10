import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  Category,
  CategorySchema,
} from 'src/shared/infra/database/schemas/category.schema';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
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
        MongooseModule.forFeature([
          { name: Category.name, schema: CategorySchema },
        ]),
      ],
      providers: [CategoryService],
    }).compile();
    service = module.get<CategoryService>(CategoryService);
  });
  afterAll(async () => {
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create an category', async () => {
    const category = await service.create({
      name: 'database',
    });
    expect(category).toHaveProperty('_id');
    expect(category.name).toBe('database');
    expect(category.status).toBeTruthy();
  });
  it('should not create category for an existing name', async () => {
    try {
      await service.create({ name: 'database' });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual(
        'E11000 duplicate key error collection: jest.categories index: name_1 dup key: { name: "database" }',
      );
    }
  });

  it('should return all categories', async () => {
    const categories = await service.index();
    expect(categories).toBeInstanceOf(Array);

    categories.forEach((category) => {
      expect(category.status).toBeTruthy();
    });
  });
});
