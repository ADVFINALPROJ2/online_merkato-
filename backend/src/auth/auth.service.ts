import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { LoginSellerDto } from './dto/login-seller.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly REFRESH_TOKEN_DAYS = 30;
  private readonly ACCESS_TOKEN_EXPIRY = '15m';
  private readonly RESET_TOKEN_HOURS = 1;

  private generateTokens(user: { id: string; email: string | null; role: string }) {
    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role },
      { expiresIn: this.ACCESS_TOKEN_EXPIRY },
    );
    return { accessToken };
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const raw = randomBytes(48).toString('hex');
    const hashed = await bcrypt.hash(raw, 10);
    const expiresAt = new Date(Date.now() + this.REFRESH_TOKEN_DAYS * 86400000);

    await this.prisma.refreshToken.create({
      data: { token: hashed, userId, expiresAt },
    });

    return raw;
  }

  private async cleanExpiredRefreshTokens(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId, expiresAt: { lt: new Date() } },
    });
  }

  private buildUserResponse(user: { id: string; firstName: string; lastName: string; email: string | null; phoneNumber: string; role: string }) {
    const tokens = this.generateTokens(user);
    return {
      message: 'Operation successful',
      accessToken: tokens.accessToken,
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

  async refresh(dto: RefreshTokenDto) {
    const tokenRecord = await this.prisma.refreshToken.findFirst({
      where: { expiresAt: { gt: new Date() } },
    });
    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const isValid = await bcrypt.compare(dto.refreshToken, tokenRecord.token);
    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: tokenRecord.userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
    const newRefreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken: this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }, { expiresIn: this.ACCESS_TOKEN_EXPIRY }),
      refreshToken: newRefreshToken,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (user) {
      const raw = randomBytes(32).toString('hex');
      const hashed = await bcrypt.hash(raw, 10);
      const expiresAt = new Date(Date.now() + this.RESET_TOKEN_HOURS * 3600000);
      await this.prisma.passwordResetToken.create({
        data: { token: hashed, userId: user.id, expiresAt },
      });
    }
    return { message: 'If account exists, reset link sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokens = await this.prisma.passwordResetToken.findMany({
      where: { expiresAt: { gt: new Date() } },
    });

    let matchedToken: typeof tokens[0] | null = null;
    for (const t of tokens) {
      if (await bcrypt.compare(dto.token, t.token)) {
        matchedToken = t;
        break;
      }
    }

    if (!matchedToken) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.prisma.user.update({
      where: { id: matchedToken.userId },
      data: { password: hashedPassword },
    });
    await this.prisma.passwordResetToken.delete({ where: { id: matchedToken.id } });

    return { message: 'Password reset successfully' };
  }
}
