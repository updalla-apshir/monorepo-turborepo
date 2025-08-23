/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/loacl-auth/loacl-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { GoogleGuardGuard } from './guards/google-guard/google-guard.guard';
import { Response } from 'express';
import { LoginThrottlerGuard } from './guards/login-throtller/login-throtller.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @UseGuards(LoginThrottlerGuard, LocalAuthGuard)
  @Post('signin')
  login(@Request() req: { user: { id: number | string; name: string } }) {
    const userId =
      typeof req.user.id === 'number' ? req.user.id : Number(req.user.id);
    return this.authService.login(userId, req.user.name);
  }
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  findAll(@Request() req) {
    return {
      messege: `you can access this protected. with user: ${req.user.id}`,
    };
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id, req.user.name);
  }

  @UseGuards(GoogleGuardGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleGuardGuard)
  @Get('google/callback')
  async googlecallback(@Request() req, @Res() res: Response) {
    // console.log('user info', req.user);
    const response = await this.authService.login(req.user.id, req.user.name);
    res.redirect(
      `http://localhost:3000/api/auth/google/callback?userId=${response.id}&name=${response.name}&accessToken=${response.accessToken}&refreshToken=${response.refreshToken}`,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  signOut(@Request() req) {
    return this.authService.signOut(req.user.id);
  }
}
