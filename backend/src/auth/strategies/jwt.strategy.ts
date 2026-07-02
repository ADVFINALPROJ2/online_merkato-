import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Ensure your .env has the SAME secret used in AuthModule
      secretOrKey: process.env.JWT_SECRET || 'OnlineMerkatoSuperSecretKey2026', 
    });
  }

  // The payload here is what comes OUT of the decrypted JWT
 async validate(payload: any) {
  console.log("JWT Payload received:", payload);
  return { 
    id: payload.sub, 
    email: payload.email, 
    role: payload.role 
  };
}
}