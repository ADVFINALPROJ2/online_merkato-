import { LoginSellerDto } from './dto/login-seller.dto';
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { LoginSellerDto } from './dto/login-seller.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterSellerDto) {
    const whereClause: any = { phoneNumber: dto.phoneNumber };
    if (dto.email) {
      whereClause.OR = [{ email: dto.email }, { phoneNumber: dto.phoneNumber }];
    }

    const existing = await this.prisma.user.findFirst({ where: whereClause });
    if (existing) {
      throw new ConflictException('A user with this email or phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        password: hashedPassword,
        role: 'SELLER',
      },
    });

      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        message: 'Seller registered successfully',
        accessToken: token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
        },
      };
  }

  async login(dto: LoginSellerDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phoneNumber: dto.email }],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or phone number');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: 'Login successful',
      accessToken: token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    };
  }

  // Moved completely INSIDE the AuthService class brackets:
  async login(dto: LoginSellerDto) {
    // 1. Find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // 2. If user doesn't exist, block them
    if (!user) {
      throw new ConflictException('Invalid email or password');
    }

    // 3. Compare the typed password with the encrypted database password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new ConflictException('Invalid email or password');
    }

    // 4. Generate a secure signature token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // 5. Return success
    return {
      message: 'Logged in successfully',
      accessToken: token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };
  }
} // This is the final closing bracket for the class