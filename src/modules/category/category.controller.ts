import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Category } from 'src/shared/infra/database/schemas/category.schema';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from 'src/shared/dtos/create-category.dto';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';

@ApiBearerAuth()
@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiResponse({
    type: [Category],
  })
  async index(): Promise<Category[]> {
    return this.categoryService.index();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @ApiResponse({
    type: Category,
  })
  async store(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }
}
