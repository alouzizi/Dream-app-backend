import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class AdminJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Token expired');
    } else if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid token');
    } else if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

  getRequest(context: ExecutionContext): Request {
    const request = context.switchToHttp().getRequest<Request>();

    // Extract token from cookie instead of header
    const token = request.cookies['Jwt-tk'];
    if (!token) {
      throw new UnauthorizedException('No token found in cookies');
    }

    // Manually attach the token to the request headers for Passport to validate
    request.headers.authorization = `Bearer ${token}`;
    return request;
  }
}
