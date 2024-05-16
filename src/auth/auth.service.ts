import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async register({ email, name, password }: RegisterDto) {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    await this.userService.create({
      email,
      name,
      password: await bcrypt.hash(password, 10),
    });

    return {
      email,
      name,
    };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.userService.findOneByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Email is wrong');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is wrong');
    }

    const payload = { email: user.email, role: user.role };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email,
    };
  }

  async profile({ email, role }: { email: string; role: string }) {
    // if (role !== 'admin') {
    //   throw new UnauthorizedException(
    //     'You are not autorizate to access this route',
    //   );
    // }

    return await this.userService.findOneByEmail(email);
  }
}
