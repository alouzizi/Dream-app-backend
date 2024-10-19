// import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
// 	handleRequest(err, user, info, context: ExecutionContext) {
// 		if (info instanceof TokenExpiredError) {
// 		  throw new UnauthorizedException('Token expired');
// 		} else if (info instanceof JsonWebTokenError) {
// 		  throw new UnauthorizedException('Invalid token');
// 		} else if (err || !user) {
// 		  throw err || new UnauthorizedException();
// 		}
// 		return user;
// 	  }
// }
