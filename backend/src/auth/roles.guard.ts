import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const switchToHttp = context.switchToHttp();
    const request = switchToHttp.getRequest();
    const user = request.user; // ◄ This is attached by your JwtStrategy!

    if (!user) {
      return false; // Throws a 401/403 if user wasn't authenticated
    }

    // Check if the user's role matches any of the allowed route roles
    return user && requiredRoles.includes(user.role);
  }
}