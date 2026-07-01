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
    // Debugging: View exactly what the server sees
    console.log("JWT Payload received:", payload);
    
    // We return this object, and NestJS attaches it to the request as 'req.user'
    return { 
      id: payload.id, 
      email: payload.email, 
      role: payload.role 
    };
  }
}