import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Request } from "express";

@Injectable()
export class CombinedJwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err, user, info, context: ExecutionContext) {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException("Token expired");
    } else if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException("Invalid token");
    } else if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

  getRequest(context: ExecutionContext): Request {
    const request = context.switchToHttp().getRequest<Request>();

    // Check if token is present in the Authorization header (for users)
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return request;
    }

    // If not found in headers, check for the token in cookies (for admins)
    console.log("Checking for token in cookies", request.cookies);
  
    const token = request.cookies["Jwt-tk"];
    if (token) {
      // Attach the token to the headers as if it was in the Authorization header
      request.headers.authorization = `Bearer ${token}`;
    }

    return request;
  }
}
