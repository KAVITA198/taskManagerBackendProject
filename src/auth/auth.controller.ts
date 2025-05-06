import { Body, Controller, Post,Request, Get,Res, Req, Patch,} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import {  ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { ForgotPassowordDto } from 'src/users/dtos/update.user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiBody({ type: RegisterDto })
    @Post('register')
    async register(@Body() dto: RegisterDto) {
      return this.authService.register(dto);
    }
    
    @ApiBody({ type: LoginDto })
    @Post('login')
  async login(@Req() req: Request,@Body() body, @Res({ passthrough: true }) res: Response) {
    const access_token = await this.authService.validateUser(body.email, body.password);
    return access_token
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Patch('reset-password')
  async resetPassword(
    @Body() forgotPasswordDto: ForgotPassowordDto,
  ) {
    return this.authService.resetPassword(forgotPasswordDto);
  }


}
