import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import crypto from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private readonly REFRESH_TOKEN_DAYS = 30;
  private readonly RESET_TOKEN_HOURS = 1;
  private readonly ACCESS_TOKEN_EXPIRY = '15m';

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

  private async buildUserResponse(user: { id: string; firstName: string; lastName: string; email: string | null; phoneNumber: string; role: string }) {
  const tokens = this.generateTokens(user);
  const refreshToken = await this.generateRefreshToken(user.id);
  return {
    message: 'Operation successful',
    accessToken: tokens.accessToken,
    refreshToken,
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

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) throw new BadRequestException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const role = dto.role ?? 'BUYER';

    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
        phoneNumber: dto.phoneNumber,
        role,
        ...(role === 'SELLER' && {
          shop: {
            create: {
              name: `${dto.firstName}'s Shop`,
              description: 'Marketplace vendor profile.',
            },
          },
        }),
      },
    });

    return this.buildUserResponse(user);
  }

  async registerDriver(dto: RegisterDriverDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) throw new BadRequestException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          phoneNumber: dto.phoneNumber,
          password: hashedPassword,
          role: 'DRIVER',
        },
      });

      await tx.driverProfile.create({
        data: {
          userId: createdUser.id,
          vehicleType: dto.vehicleType,
          licensePlate: dto.licensePlate,
          idImageUrl: dto.idImageUrl,
          licenseImageUrl: dto.licenseImageUrl,
        },
      });

      return createdUser;
    });

    return this.buildUserResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    return this.buildUserResponse(user);
  }

  async refresh(dto: RefreshTokenDto) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { expiresAt: { gt: new Date() } },
    });

    let matchedToken: typeof tokens[0] | null = null;
    for (const t of tokens) {
      if (await bcrypt.compare(dto.refreshToken, t.token)) {
        matchedToken = t;
        break;
      }
    }

    if (!matchedToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: matchedToken.userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.prisma.refreshToken.delete({ where: { id: matchedToken.id } });
    const newRefreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken: this.jwtService.sign(
        { sub: user.id, email: user.email, role: user.role },
        { expiresIn: this.ACCESS_TOKEN_EXPIRY },
      ),
      refreshToken: newRefreshToken,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (user) {
      const raw = crypto.randomBytes(32).toString('hex');
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
