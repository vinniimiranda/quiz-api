import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/shared/dtos/create-user.dto';
import { LoginDto } from 'src/shared/dtos/login.dto';
import { AuthService } from './auth.service';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/shared/infra/database/schemas/user.schema';

class Token {
  @ApiProperty()
  public accessToken: string;

  @ApiProperty({ example: 36400 })
  public expiresIn: number;
}

class LoginResponse {
  @ApiProperty()
  public user: User;

  @ApiProperty()
  public token: Token;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    type: User,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    type: LoginResponse,
  })
  async login(@Res() res: Response, @Body() loginDto: LoginDto): Promise<any> {
    const user = await this.authService.login(loginDto);

    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    }

    return res.status(200).json(user);
  }
}
