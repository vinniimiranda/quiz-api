import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  Category,
  CategorySchema,
} from 'src/shared/infra/database/schemas/category.schema';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
  let controller: CategoryController;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [CategoryController],
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
    controller = module.get<CategoryController>(CategoryController);
  });
  afterAll(async () => {
    module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should create an category', async () => {
    const category = await controller.store({ name: 'front-end' });
    expect(category).toHaveProperty('_id');
    expect(category.name).toBe('front-end');
    expect(category.status).toBeTruthy();
  });

  it('should not create category for an existing name', async () => {
    try {
      await controller.store({ name: 'front-end' });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual(
        'E11000 duplicate key error collection: jest.categories index: name_1 dup key: { name: "front-end" }',
      );
    }
  });
  it('should return all categories', async () => {
    const categories = await controller.index();
    expect(categories).toBeInstanceOf(Array);

    categories.forEach((category) => {
      expect(category.status).toBeTruthy();
    });
  });
});
