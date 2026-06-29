import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { LoginSellerDto } from './dto/login-seller.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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
    const raw = crypto.randomBytes(48).toString('hex');
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
        email: dto.email || null,
        phoneNumber: dto.phoneNumber,
        password: hashedPassword,
        role: 'SELLER',
      },
    });

    const result = this.buildUserResponse(user);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      message: 'Seller registered successfully',
      ...result,
      refreshToken,
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

    const result = this.buildUserResponse(user);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      message: 'Login successful',
      ...result,
      refreshToken,
    };
  }

  async refresh(dto: RefreshTokenDto) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { expiresAt: { gt: new Date() } },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    let matched: (typeof tokens)[0] | null = null;
    for (const t of tokens) {
      if (await bcrypt.compare(dto.refreshToken, t.token)) {
        matched = t;
        break;
      }
    }

    if (!matched) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.refreshToken.delete({ where: { id: matched.id } });

    const result = this.buildUserResponse(matched.user);
    const newRefreshToken = await this.generateRefreshToken(matched.user.id);

    return {
      message: 'Token refreshed successfully',
      ...result,
      refreshToken: newRefreshToken,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      return { message: 'If an account with that email exists, a reset link has been sent.' };
    }

    const raw = crypto.randomBytes(32).toString('hex');
    const hashed = await bcrypt.hash(raw, 10);
    const expiresAt = new Date(Date.now() + this.RESET_TOKEN_HOURS * 3600000);

    await this.prisma.passwordResetToken.create({
      data: { token: hashed, email: dto.email, expiresAt },
    });

    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
      });

      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${raw}`;

      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@digitalmerkato.com',
        to: dto.email,
        subject: 'Password Reset - Digital Merkato',
        text: `You requested a password reset. Click the link to reset your password: ${resetUrl}. This link expires in 1 hour.`,
        html: `<p>You requested a password reset.</p><p>Click <a href="${resetUrl}">here</a> to reset your password.</p><p>This link expires in 1 hour.</p>`,
      });
    } catch {
      console.warn('Failed to send password reset email. SMTP not configured.');
    }

    return { message: 'If an account with that email exists, a reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokens = await this.prisma.passwordResetToken.findMany({
      where: { expiresAt: { gt: new Date() }, usedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    let matched: (typeof tokens)[0] | null = null;
    for (const t of tokens) {
      if (await bcrypt.compare(dto.token, t.token)) {
        matched = t;
        break;
      }
    }

    if (!matched) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    await this.prisma.user.update({
      where: { email: matched.email },
      data: { password: hashedPassword },
    });

    await this.prisma.passwordResetToken.update({
      where: { id: matched.id },
      data: { usedAt: new Date() },
    });

    return { message: 'Password reset successfully. You can now log in with your new password.' };
  }
}
