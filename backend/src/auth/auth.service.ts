import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

interface JwtPayload {
  sub: string; // User ID
  username: string;
  roles?: string[]; // Optional roles array
  // Add other custom claims as needed
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

   async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    // user is a Mongoose document or null
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject(); // .toObject() is valid on a Mongoose doc
      return result;
    }
    return null;
  }

  async login(user: any) {
    // const payload = { username: user.email, sub: user._id };
    const payload: JwtPayload = {
      sub: "68c5610e2e16fc673469dc9c",
      username: user.email,
      roles: [],
    };
    console.log(payload)
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}