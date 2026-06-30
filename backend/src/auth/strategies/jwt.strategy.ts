import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  async validate(payload: { id: string; email: string; role: string }) {
    // 1. Fetch user from DB to ensure they still exist
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        // Add other necessary fields (e.g., isActive, role)
      },
    });

    // 2. If user doesn't exist, throw Unauthorized
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    // 3. Return the user object - this will be attached to request.user
    return {
      id: user.id,
      email: user.email,
      role: payload.role,
    };
  }
}