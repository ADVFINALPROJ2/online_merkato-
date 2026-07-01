import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

interface JwtPayload {
  id: string;    // ◄ Change 'sub' to 'id' to match your login token structure
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'OnlineMerkatoSuperSecretKey2026',
    });
  }

  async validate(payload: any) {
  // 🧪 TEMPORARY TEST: Bypass the database lookup completely
  console.log('Decrypted Token Payload:', payload);
  
  return { 
    id: payload.id || payload.sub, 
    email: payload.email, 
    role: payload.role 
  };
}
}