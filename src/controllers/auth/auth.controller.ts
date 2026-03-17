import { Body, Controller, Post } from '@nestjs/common';
import { LoginSchema, type LoginDto } from 'src/dto/auth/login.dto';
import { ZodValidationPipe } from 'src/pipe/zod-validation.pipe';
import { AuthService } from 'src/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body(new ZodValidationPipe(LoginSchema)) payload: LoginDto) {
    return this.authService.login(payload);
  }
}
