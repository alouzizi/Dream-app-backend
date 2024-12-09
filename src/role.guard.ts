import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // No specific roles required, allow access
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new UnauthorizedException('User not authenticated or role not defined');
    }

    const hasRequiredRole = requiredRoles.some(role => user.role === role);
    if (!hasRequiredRole) {
      throw new UnauthorizedException(`User does not have the required role. Required: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}