import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(private readonly jwtService: JwtService) {}

  getHello(): string {
    return 'Hello World!';
  }

  checkJwtService(): string {
    // ... your JWT test logic here
    return 'JWT Service is working correctly!';
  }
}