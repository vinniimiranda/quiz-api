import { Controller, Get, UseGuards } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  User,
  UserDocument,
} from 'src/shared/infra/database/schemas/user.schema';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'Users',
    type: User,
  })
  async index(): Promise<User[]> {
    return this.userModel.find();
  }
}
