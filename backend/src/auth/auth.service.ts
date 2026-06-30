import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client'; 

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Verify if the email is already in use
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // 2. Hash the user password securely
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    // 3. Normalize phone
    const normalizedPhone = dto.phoneNumber.startsWith('0') 
      ? dto.phoneNumber.replace('0', '+251') 
      : dto.phoneNumber;

    // 4. Prepare base user data
    const userData: any = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hashedPassword,
      phoneNumber: normalizedPhone,
      role: dto.role || Role.BUYER,
    };

  
    // 5. Conditional logic: Only create a shop if the role is SELLER
    if (dto.role === Role.SELLER) {
      userData.shop = {
        create: {
          name: `${dto.firstName}'s Shop`,
          description: 'Marketplace vendor profile.',
        },
      };
    }

    // 6. Create the user
    const user = await this.prisma.user.create({
      data: userData,
    });

    // 7. Generate JWT token
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(dto: LoginDto) {
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
      accessToken: this.jwtService.sign(payload),
      user: { 
        id: user.id, 
        name: `${user.firstName} ${user.lastName}`.trim(), 
        email: user.email, 
        role: user.role 
      },
    };
  }
}