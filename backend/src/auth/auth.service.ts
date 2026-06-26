import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { LoginSellerDto } from './dto/login-seller.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterSellerDto) {
    // 1. Verify if the email is already in use
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // 2. Hash the user password securely
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    // 3. Create the user and their associated shop directly matching your exact DTO fields
    return this.prisma.user.create({
      data: {
        firstName: dto.firstName,     // <-- Maps directly to your DTO
        lastName: dto.lastName,       // <-- Maps directly to your DTO
        email: dto.email,
        password: hashedPassword,
        phoneNumber: dto.phoneNumber, // <-- Maps directly to your DTO
        role: 'SELLER',
        shop: {
          create: {
            name: `${dto.firstName}'s Shop`, // Auto-generates a cool fallback name matching the user
            description: 'Sustainable fashion and custom apparel marketplace vendor profile.',
          },
        },
      },
    });
  }

  async login(dto: LoginSellerDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { 
        id: user.id, 
        name: `${user.firstName} ${user.lastName}`.trim(), 
        email: user.email, 
        role: user.role 
      },
    };
  }
}